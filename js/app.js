const criptomonedas = document.querySelector('#criptomonedas');
const formulario = document.querySelector('#formulario');
const moneda = document.querySelector('#moneda');
const result = document.querySelector('#resultado');
//Objeto donde se almacena la eleccion del usuario
const objBusq = {
    criptomoneda: '',
    moneda: ''
}

//Eventos
document.addEventListener('DOMContentLoaded',consultarCriptomonedas)
moneda.addEventListener('change',leerValor)
criptomonedas.addEventListener('change',leerValor)
formulario.addEventListener('submit',comprobarCampos)
//Consulta las criptomonedas para el selector
function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(response => response.json())
        .then(json => agregarCriptos(json.Data))
}
//Consulta la api con los valores ingresados
function consultarApi(moned,crypt) {
    
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${crypt}&tsyms=${moned}`

    fetch(url)
        .then(response => response.json())
        .then(json => mostrarDatos(json.DISPLAY[crypt][moned]))
}
//Agrega las opciones de las criptomonedas al selector
function agregarCriptos(cripto) {
    cripto.forEach(crip=>{
        const {CoinInfo:{FullName,Name}} = crip;

        const option = document.createElement('option')
        option.value = Name;
        option.textContent = FullName;

        criptomonedas.appendChild(option)
    })
}
//comprueba que el usuario haya seleccionado opciones validas
function comprobarCampos(e) {
    e.preventDefault()
    crearSpinner()
    const {criptomoneda,moneda} = objBusq;

    if(criptomoneda == '' || moneda == '') {
        return mostrarError('Ambos campos son obligatorios');
    }

    consultarApi(moneda,criptomoneda)
}


function leerValor(e) {
    objBusq[e.target.name] = e.target.value;

}

function mostrarDatos(crypto) {
    console.log(crypto);
    const {PRICE,HIGHDAY,LOWDAY,LASTUPDATE,CHANGEPCT24HOUR} = crypto;
    limpiarHTML()

    const cryp = document.createElement('p')
    cryp.className = 'precio'
    cryp.innerHTML = `<span>${objBusq.criptomoneda}</span>`

    const precio = document.createElement('p')
    precio.className = 'precio'
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`
    
    const precioBajo = document.createElement('p')
    precioBajo.innerHTML = `El precio mas Bajo del dia fue: <span>${LOWDAY}</span>`

    const precioAlto = document.createElement('p')
    precioAlto.innerHTML = `El precio mas Alto del dia fue: <span>${HIGHDAY}</span>`

    const precioUltimasHoras = document.createElement('p')
    precioUltimasHoras.innerHTML = `Variacion del precio de las ultimas horas fue: <span>${CHANGEPCT24HOUR}%</span>`

    const ultimaActualizacion = document.createElement('p')
    ultimaActualizacion.innerHTML = `Ultima actualizacion fue: <span>${LASTUPDATE}</span>`


    resultado.appendChild(cryp)
    resultado.appendChild(precio)
    resultado.appendChild(precioBajo)
    resultado.appendChild(precioAlto)
    resultado.appendChild(precioUltimasHoras)
    resultado.appendChild(ultimaActualizacion)
}


function mostrarError(msg) {
    const alerta = document.querySelector('.error')

    if(!alerta) {
        limpiarHTML()
        const divMensaje = document.createElement('div')
        divMensaje.classList.add('error')
        divMensaje.textContent = msg;
        
        result.appendChild(divMensaje)

        setTimeout(() => {
            divMensaje.remove()
        }, 3000);
    }
}

function limpiarHTML() {
    while(result.firstChild) {
        result.removeChild(result.firstChild)
    }
}

function crearSpinner() {
    limpiarHTML()
    result.innerHTML = `
    <div class="spinner">
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    </div>
    `

}