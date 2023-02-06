let clientName = '';
do {
    clientName = prompt("Bem Vindo(a) ao Fashion Driven! Digite seu nome:");
} while ( clientName === '' || clientName === null);

let model;
function selectModel(option){
    let optionSelected = document.querySelector(".models .selected");
    if (optionSelected !== null){
        optionSelected.classList.remove("selected");
    }
    option.firstElementChild.classList.add("selected");
    model = document.querySelector(".models .selected").parentNode.lastElementChild.innerHTML;
}

let collar;
function selectCollar(option){
    let optionSelected = document.querySelector(".collars .selected");
    if (optionSelected !== null){
        optionSelected.classList.remove("selected");
    }
    option.firstElementChild.classList.add("selected");
    collar = document.querySelector(".collars .selected").parentNode.lastElementChild.innerHTML;
}

let tissue;
function selectTissue(option){
    let optionSelected = document.querySelector(".tissues .selected");
    if (optionSelected !== null){
        optionSelected.classList.remove("selected");
    }
    option.firstElementChild.classList.add("selected");
    tissue = document.querySelector(".tissues .selected").parentNode.lastElementChild.innerHTML;
}

const isURL = (str) => { try { let url = new URL(str); return true; } catch { return false ;} };
const inputTag = document.querySelector("input");

inputTag.addEventListener("keyup", function(event){ verifyOrder() });

function verifyOrder(){
    const buttonSend = document.querySelector("button");
    if (model !== undefined && collar !== undefined && tissue !== undefined && isURL(inputTag.value)){
        buttonSend.classList.add("order-done");
        buttonSend.disabled = false;
    } else {
        buttonSend.classList.remove("order-done");
        buttonSend.disabled = true;
    }
}

function confirmOrder(){
    alert("Enviando seu pedido...");

    let order = {
        "model": model,
	    "neck": collar,
	    "material": tissue,
	    "image": inputTag.value,
	    "owner": clientName,
	    "author": clientName
    };
    axios.post("https://mock-api.driven.com.br/api/v4/shirts-api/shirts",order)
    .then(x => {alert("Pedido enviado!");loadShirts()})
    .catch(x => alert("Ops, não conseguimos processar sua encomenda."));
}

let Data;
function loadShirts(){
    axios.get("https://mock-api.driven.com.br/api/v4/shirts-api/shirts").then(loadSuccess).catch(loadError);

    function loadSuccess(Response){
        Data = Response.data;
        const ulTag = document.querySelector('ul');
        ulTag.innerHTML = '';
        Data.forEach( x => ulTag.innerHTML += 
            `<li onclick="selectShirt(this)">
                <img src=${x.image} alt="Blusa ${x.id}" id="${x.id}">
                <h3><strong>Criador:</strong> ${x.owner}</h3>
            </li>` );
    }

    function loadError(Response){
        alert("Erro ao conectar com o servidor! Tente novamente mais tarde.");
    }
}
loadShirts();

let answer
function selectShirt(liTag){
    liTag.classList.add("selected");
    let idShirt = liTag.firstElementChild.id;
    let order = {};

    Data.forEach(x => {
        if (x.id == idShirt){
            order = {
                "model": x.model,
                "neck": x.neck,
                "material": x.material,
                "image": x.image,
                "owner": x.owner,
                "author": clientName
            };
        }
    });

    setTimeout(confirmSelection,200);

    function confirmSelection(){
        answer = confirm("Deseja encomendar a camiseta selecionada?");
        if (answer) {
            alert("Enviando seu pedido...");
            axios.post("https://mock-api.driven.com.br/api/v4/shirts-api/shirts",order)
            .then(x => {alert("Pedido enviado!");loadShirts()})
            .catch(x => alert("Ops, não conseguimos processar sua encomenda."));
        }
        liTag.classList.remove("selected");
    }
}