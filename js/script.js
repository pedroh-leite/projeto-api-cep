const addressForm = document.querySelector("#address-form");
const cepInput = document.querySelector("#cep");
const addressInput = document.querySelector("#address");
const cityInput = document.querySelector("#city");
const neighborhoodInput = document.querySelector("#neighborhood");
const regionInput = document.querySelector("#region");
const formInputs = document.querySelectorAll("[data-input]");

const closeButton = document.querySelector("#close-message");

const fadeElement = document.querySelector("#fade");

// VALIDATE CEP INPUT
cepInput.addEventListener("keypress", (e) => {

    const onlyNumbers = /[0-9]/;
    const key = String.fromCharCode(e.keyCode);
 
    // Allow only numbers
    if(!onlyNumbers.test(key)) {
        e.preventDefault()
        return;
    }
});

// GET ADDRESS EVENT
cepInput.addEventListener("keyup", (e) => {
    
    const inputValue = e.target.value

    // Check if we have correct length
    if(inputValue.length === 8) {
        getAddress(inputValue);
    }
});

// GET CUSTOMER ADDRESS FROM API
const getAddress = async (cep) => {
    toggleLoader();

    cepInput.blur();

    const apiUrl = `https://viacep.com.br/ws/${cep}/json/`;

    const response = await fetch(apiUrl);

    const data = await response.json();

    // Show error and reset form
    if(data.erro === "true") {
        if(!addressInput.hasAttribute("disabled")) {
            toggleDisabled();
        }

        addressForm.reset();
        toggleLoader();
        toggleMessage("CEP Inválido, tente novamente.");
        return;
    }

    if(addressInput.value === ""){
        toggleDisabled();
    }

    addressInput.value = data.logradouro;
    cityInput.value = data.localidade;
    neighborhoodInput.value = data.bairro;
    regionInput.value =data.uf;

    toggleLoader();
};

// ADD OR REMOVE DISABLED ATTRIBUTE
const toggleDisabled = () => {

    if(regionInput.hasAttribute("disabled")){
        formInputs.forEach((input) =>{
            input.removeAttribute("disabled")
        })
    } else {
        formInputs.forEach((input) => {
            input.setAttribute("disabled", "disabled")
        })
    }

}

// SHOW OR HIDE LOADER 
const toggleLoader = () => {
    const loaderElement = document.querySelector("#loader");

    fadeElement.classList.toggle("hide");
    loaderElement.classList.toggle("hide");
};

// SHOW OR HIDE MESSAGE
const toggleMessage = (msg) => {

    const messageElement = document.querySelector("#message");

    const messageElementText = document.querySelector("#message p");

    messageElementText.innerText = msg;

    fadeElement.classList.toggle("hide");
    messageElement.classList.toggle("hide");
};

//  CLOSE MESSAGE MODAL
closeButton.addEventListener("click", () => toggleMessage());

// SAVE ADDRESS
addressForm.addEventListener("submit", (e) => {

    e.preventDefault();

    toggleLoader()

    setTimeout(() => {
        toggleLoader();

        toggleMessage("Endereço salvo com sucesso!");

        addressForm.reset();

        toggleDisabled();
    }, 1500)

})