//obtenemos referencias del DOM
let fieldset2 = document.getElementById('f2');
let fieldset3 = document.getElementById('f3');
fieldset2.disabled = true;
fieldset3.disabled = true;

const btnEnvio = document.getElementById('btEnvio');
btnEnvio.disabled = true;

//definimos reglas de validacion
const reglas = {
  nombre: /^[a-zA-Z\s]+$/,
  apellido: /^[a-zA-Z\s]+$/,
  telefono: /^\d{0,9}$/,
  noches: /^(?:[0-9]|[1-8][0-9]|90)$/
}

//capturamos primer fieldset y validamos
const fieldset1 = Array.from(document.querySelectorAll('.f1 .contdivf1 input'));

fieldset1.forEach(input => {
  input.addEventListener('input', e => {
    const valor = e.target.value.trim();
    const spanError = e.target.nextElementSibling;
    const evaluar = reglas[e.target.id];

    if (valor === "") {
      e.target.classList.remove('inputError');
      spanError.classList.remove('error');
      spanError.style.display = 'none';
      return;
    }
    if (!evaluar.test(valor)) {
      spanError.textContent = "formato incorrecto";
      e.target.classList.add('inputError');
      spanError.classList.add('error');
      spanError.style.display = 'block';
      return;
    } else {
      spanError.textContent = "";
      e.target.classList.remove('inputError');
      spanError.classList.remove('error');
      spanError.style.display = 'none';
      return;
    }
  })

})

//habilitamos fieldset
fieldset1.forEach(input => {
  input.addEventListener('input', () => {
    const campoVacio = fieldset1.some(i => i.value === '');
    const campoError = fieldset1.some(c => c.classList.contains('inputError'));
    fieldset2.disabled = campoVacio || campoError;
  })
})

/*----.f2-------- */
//fechas
const fecha = new Date();
const anio = fecha.getFullYear()
const mes = String(fecha.getMonth() + 1).padStart(2, '0');
const dia = String(fecha.getDate()).padStart(2, '0');
const fechaActual = `${anio}-${mes}-${dia}`;

//valores de input-fecha
const inpFechaInicio = document.getElementById('fechaInicio');
inpFechaInicio.setAttribute('min', fechaActual);

const inpFechaSalida = document.getElementById('fechaSalida');
inpFechaSalida.setAttribute('min', fechaActual);

/*-----validación de fechas------- */
const fechas = Array.from(document.querySelectorAll('.f2 input[type=date]'));
let fechVacia;
let radVacio = true;
const radios = Array.from(document.querySelectorAll('.f2 input[type=radio]'));

//valores de fechas
let ordenIncorrecto = false;
fechas.forEach(f => {
  f.addEventListener('input', () => {
    //verificar si algun campo de fecha está vacío
    fechVacia = fechas.some(fech => fech.value.trim() === '');

    //validar orden
    if (inpFechaInicio.value && inpFechaSalida.value) {
      ordenIncorrecto = new Date(inpFechaSalida.value) < new Date(inpFechaInicio.value);
    }else{
      ordenIncorrecto=true;
    }
    //estados
    fieldset3.disabled = fechVacia || radVacio || ordenIncorrecto;
    btnEnvio.disabled = radVacio || fechVacia || ordenIncorrecto;

    if (inpFechaInicio.value && inpFechaSalida.value && ordenIncorrecto) {
      inpFechaSalida.style.borderColor = 'red';
      inpFechaSalida.setAttribute('title', 'Fecha de salida no debe ser menor');
    } else {
      inpFechaSalida.style.borderColor = '';
      inpFechaSalida.removeAttribute('title', 'Fecha de salida no debe ser menor');
    }
  })
})

radios.forEach(f => {
    f.addEventListener('change', () => {
      //validar si algun radio está seleccionado
    radVacio = !radios.some(r => r.checked);

    // Recalcular fechas
    fechVacia = fechas.some(fech => fech.value.trim() === '');
    if (inpFechaInicio.value && inpFechaSalida.value) {
      ordenIncorrecto = new Date(inpFechaSalida.value) < new Date(inpFechaInicio.value);
    }
    if(inpFechaInicio.value.trim() === '' || inpFechaSalida.value.trim() === ''){
      ordenIncorrecto = true;
    }

    // Actualizar estados
    fieldset3.disabled = radVacio || fechVacia || ordenIncorrecto;
    btnEnvio.disabled = radVacio || fechVacia || ordenIncorrecto;

    // Estilos y tooltip
    if (ordenIncorrecto) {
      inpFechaSalida.setAttribute('title', 'Fecha de salida no debe ser menor');
    } else {
      inpFechaSalida.style.borderColor = '';
      inpFechaSalida.removeAttribute('title');
    }
  });

})

/*-------Elementos del DOM---------- */
const form = document.getElementById('formulario');
const contDatos = document.getElementById('contDiv');
const contSpinner = document.getElementById('contSpinner');

//ocultar contenedores
contDatos.style.display = 'none';
contSpinner.style.display = 'none';

//Evento click
btnEnvio.addEventListener('click', e => {
  e.preventDefault();
  //validacion nativa
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  //ocultamos el formulario
  form.style.display = 'none';

  //mostramos solo el spinner
  contSpinner.style.display = 'block';
  contSpinner.innerHTML = '';

  //crear spinner dinamicamente
  const spinner = document.createElement('div');
  spinner.classList.add('cargando');
  contSpinner.appendChild(spinner);

  //simulacion de espera
  setTimeout(() => {
    //ocultamos el spinner
    contSpinner.style.display = 'none';
    contSpinner.innerHTML = '';

    //mostramos contenedor de datos
    contDatos.style.display = 'block';
    contDatos.classList.add('contDatosDinamicos');
    contDatos.innerHTML = '';

    //crear tutulo y msn
    const h2 = document.createElement('h2');
    h2.textContent = 'DATOS DE RESERVA';

    const p = document.createElement('p');
    p.textContent = 'Hola; gracias por su preferencia';

    contDatos.append(h2, p);

    const forDat = new FormData(form);

    for (const [campo, valor] of forDat.entries()) {
      const parrafo = (document.createElement('p'));
      parrafo.innerHTML = `
    <span class="campo">${campo}</span>
    <span class="valor">${valor}</span>`;

      contDatos.appendChild(parrafo);
    }
    //boton cerrar dinámico
    const btnCerrar = document.createElement('button');
    btnCerrar.setAttribute('title', 'Cerrar')
    btnCerrar.classList.add('btnClosed');
    btnCerrar.textContent = 'X';
    contDatos.appendChild(btnCerrar);
    btnCerrar.addEventListener('click', () => location.reload());

  }, 2500);

})
//evento al boton reset
form.addEventListener('reset', () => {
  //estados iniciales(desactivados)
  fieldset2.disabled = true;
  fieldset3.disabled = true;
  btnEnvio.disabled = true;
})

