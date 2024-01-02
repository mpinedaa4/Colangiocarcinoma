document.addEventListener("DOMContentLoaded", function() {
    const tabs = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content");
    tabContents.forEach(content => content.classList.remove("active"));
    // Crea una variable para almacenar el color original de cada pestaña
    const originalTabColors = {};
    tabs.forEach(tab => {
      originalTabColors[tab] = tab.style.backgroundColor;
    });
  
    // Agrega un listener de eventos "click" a cada pestaña
    tabs.forEach(tab => {
      // Activa el tab1 al iniciar
      tab.classList.add("active");
      tab.addEventListener("click", () => {
        const h1Element = document.querySelector("h1");
        h1Element.style.display = "none";
        const pElement = document.querySelector("p");
        pElement.style.display = "none";
        // Obtiene el color original de la pestaña
        const originalColor = originalTabColors[tab];
  
        // Obtiene el color nuevo de la pestaña
        const newColor = "#65bee5";
  
        // Establece el color de la pestaña al color nuevo
        tab.style.backgroundColor = newColor;
  
        // Elimina el color de la pestaña anterior
        tabs.forEach(t => {
          if (t !== tab) {
            t.style.backgroundColor = originalColor;
          }
        });
  
        // Oculta todos los contenidos de pestañas
        tabContents.forEach(content => content.classList.remove("active"));
  
        // Muestra el contenido de la pestaña correspondiente
        const target = tab.querySelector("a").getAttribute("href");
        document.querySelector(target).classList.add("active");
      });
    });
  });

(function () {

  let maximized = true;

  function updateMaximizeIcon() {
    // Obtener el botón por su ID
    const maxBtn = document.getElementById("max-btn");

    // Cambiar el contenido del botón basándote en el estado de maximized
    maxBtn.innerHTML = maximized ? "&#8601;" : "&#9634;";
  }

  function init() { 
    document.getElementById("min-btn").addEventListener("click", function (e) {
      window.electronAPI.minimizarMain();
    });

    document.getElementById("max-btn").addEventListener("click", function (e) {
      if (maximized) {
        window.electronAPI.restaurarMain();
      } else {
        window.electronAPI.maximizarMain();
      }
      maximized = !maximized;
      updateMaximizeIcon();
    });
    
    document.getElementById("close-btn").addEventListener("click", function (e) {
      window.electronAPI.cerrarMain();
    });
  }; 
  
  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      init(); 
    }
  };
})();
  
function capitalize(str) {
  return str
  .split(' ')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');
}

function validarFormulario() {
  const formulario = document.getElementById('main-form');

  // Iterar sobre los elementos del formulario
  Array.from(formulario.elements).forEach(elemento => {
    // Verificar si el elemento es un input, select, radio o checkbox y si es inválido
    if (
      (elemento.tagName === 'INPUT' || elemento.tagName === 'SELECT') &&
      elemento.checkValidity() === false
    ) {
      // Aplicar estilo de campo inválido
      elemento.classList.add('campo-invalido');
    } else {
      // Remover estilo de campo inválido si existe
      elemento.classList.remove('campo-invalido');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Obtener referencia al formulario y al botón de submit
  const formulario = document.getElementById('main-form');
  const btn = document.getElementById('save');

  // Verificar si los elementos existen antes de agregar el event listener
  if (formulario && btn) {
    // Agregar un event listener al formulario
    btn.addEventListener('click', (event) => {
      // Prevenir el comportamiento predeterminado del formulario (recargar la página)
      event.preventDefault();

      // Aquí puedes realizar acciones adicionales antes de enviar el formulario,
      // si es necesario.
      if (!formulario.checkValidity()){
        alert('Formulario incompleto:\nPor favor revisar los datos faltantes');
        validarFormulario();
        return;
      }
      else{
        validarFormulario();
      }

      try {
        //tab1
        const consecutivo = document.getElementById('consecutivo').value;
        const iniciales = document.getElementById('iniciales').value;
        const sexo = document.getElementById('sexo').value;
        const yearOfBirth = document.getElementById('yearOfBirth').value;
        const regimen = document.getElementById('regimen').value;

        //tab2
        const fecha_dx = document.getElementById('fecha_dx').value;
        const yearOfDiagnosis = new Date(fecha_dx).getFullYear();
        const edad = yearOfDiagnosis - yearOfBirth;
        const histologia = document.getElementById('histologia').value;
        const diferenciacion = document.getElementById('diferenciacion').value;
        const localizacion = document.getElementById('localizacion').value;
        const tnm = document.getElementById('tnm').value;
        const estadio = document.getElementById('estadio').value;
        const ecog = document.getElementById('ecog').value;

        //tab3
        const ca19 = document.getElementById('ca19').value;
        const cea = document.getElementById('cea').value;
        const ngs = document.querySelector('input[name="ngs"]:checked').value;
        const ngsResult = document.getElementById('ngsResult').value;

        //tab4
        const cx = document.querySelector('input[name="cx"]:checked').value;
        const fecha_cx = document.getElementById('fecha_cx').value;
        const intencionCx = document.getElementById('intencionCx').value;
        const sistemico = document.querySelector('input[name="sistemico"]:checked').value;
        const nombreTerapia = document.getElementById('nombreTerapia').value;
        const fechaTerapia = document.getElementById('fechaTerapia').value;
        const escenario = document.getElementById('escenario').value;
        const respuesta = document.getElementById('respuesta').value;
        const rxtx = document.querySelector('input[name="rxtx"]:checked').value;
        const radiocirugia = document.getElementById('radiocirugia').value;

        //tab5
        const progresion = document.querySelector('input[name="progresion"]:checked').value;
        const fechaProgresion = document.getElementById('fechaProgresion').value;
        const radioPrimeraLinea = document.querySelector('input[name="segundaLinea"]:checked');
        let primeraLinea;
        if (radioPrimeraLinea) {
            primeraLinea = radioPrimeraLinea.value;
        } else {
            primeraLinea = '';
        }
        const nombreTto1 = capitalize(document.getElementById('nombreTto1').value);
        const radioSegundaLinea = document.querySelector('input[name="segundaLinea"]:checked');
        let segundaLinea;
        if (radioSegundaLinea) {
            segundaLinea = radioSegundaLinea.value;
        } else {
            segundaLinea = '';
        }
        const nombreTto2 = capitalize(document.getElementById('nombreTto2').value);

        //tab6
        const estadoVital = document.getElementById('estadoVital').value;
        const ultimoSeguimiento = document.getElementById('ultimoSeguimiento').value;
        const fechaMuerte = document.getElementById('fechaMuerte').value;
        const observaciones = document.getElementById('observaciones').value;
        const sitio = document.getElementById('sitio').value;
        const dataEntry = document.getElementById('dataEntry').value;
      
    
        const data = [
        consecutivo, iniciales, sexo, edad, regimen, fecha_dx, histologia, diferenciacion, localizacion, tnm, estadio, ecog, ca19, cea,
        ngs, ngsResult, cx, fecha_cx, intencionCx, sistemico, nombreTerapia, fechaTerapia, escenario, respuesta, rxtx, radiocirugia,
        progresion, fechaProgresion, primeraLinea, nombreTto1, segundaLinea, nombreTto2, estadoVital, ultimoSeguimiento, fechaMuerte,
        observaciones, sitio, dataEntry
        ];

        window.electronAPI.sendForm(data);
        window.electronAPI.saveResult((event, value) => {
          if(value == true){
            clearForm(formulario);
            inicializarBiomarcadores();
            inicializarTratamiento();
            inicializarProgresion();
            inicializarEstadoVital();
          }
        })
        
      } 
      catch (error) {
        console.error("Error:", error);
      }
    });
  } else {
    console.error('No se encontraron los elementos del formulario o el botón de submit.');
  }
});


const btnOpen = document.getElementById('excel');

btnOpen.addEventListener('click', (event) => {
  event.preventDefault();
  window.electronAPI.openExcel();
});



function clearForm(formulario){
  for (const elemento of formulario.elements) {
    // Verificar el tipo de elemento
    switch (elemento.type) {
      case 'text':
      case 'number':
      case 'password':
      case 'textarea':
      case 'select-one':
      case 'date':
        // Establecer el valor en una cadena vacía para inputs de texto, número, contraseña, textarea y select
        elemento.value = '';
        break;
      case 'checkbox':
      case 'radio':
        // Desmarcar checkboxes y radios
        elemento.checked = false;
        break;
      }
    }
}


function inicializarBiomarcadores() {
  // tab3 - biomarcadores 
  var ngsRadioSi = document.getElementById("ngs1");
  var ngsRadioNo = document.getElementById("ngs2");
  var ngsInputPair = document.getElementById("input-pair-ngs");

  // Oculta inicialmente los elementos
  ngsInputPair.style.display = 'none';

  // Agrega un evento de cambio al radio button "biomarcadores1"
  ngsRadioSi.addEventListener('change', function() {
    console.log('ngsRadioSi change event triggered');
    if (this.checked) {
      ngsInputPair.style.display = 'flex';
    }
  });

  ngsRadioNo.addEventListener('change', function() {
    if (this.checked) {
      ngsInputPair.style.display = 'none';
      ngsResult.value = '';
    }
  });
}

function inicializarTratamiento() {
  // tab4 - tto inicial
  var cxSi = document.getElementById("cx1");
  var cxNo = document.getElementById("cx2");
  var fechaCxInputPair = document.getElementById("input-pair-fechaCx");
  var intencionInputPair = document.getElementById("input-pair-intencion");
  var sistemicoSi = document.getElementById("sistemico1");
  var sistemicoNo = document.getElementById("sistemico2");
  var nombreTerapiaInputPair = document.getElementById("input-nombre-terapia");
  var fechaTerapiaInputPair = document.getElementById("input-fecha-terapia");
  var escenarioInputPair = document.getElementById("input-escenario");

  fechaCxInputPair.style.display = 'none';
  intencionInputPair.style.display = 'none';
  nombreTerapiaInputPair.style.display = 'none';
  fechaTerapiaInputPair.style.display = 'none';
  escenarioInputPair.style.display = 'none';

  cxSi.addEventListener('change', function() {
    if (this.checked) {
      fechaCxInputPair.style.display = 'flex';
      intencionInputPair.style.display = 'flex';
      fecha_cx.required = true;
    }
  });

  cxNo.addEventListener('change', function() {
    if (this.checked) {
      fechaCxInputPair.style.display = 'none';
      intencionInputPair.style.display = 'none';
      fecha_cx.required = false;
      fecha_cx.value = '';
      intencionCx.value = '';
    }
  });

  sistemicoSi.addEventListener('change', function() {
      if (this.checked) {
        nombreTerapiaInputPair.style.display = 'flex';
        fechaTerapiaInputPair.style.display = 'flex';
        escenarioInputPair.style.display = 'flex';
        nombreTerapia.required = true;
        fechaTerapia.required = true;
      }
    });
  
    sistemicoNo.addEventListener('change', function() {
      if (this.checked) {
        nombreTerapiaInputPair.style.display = 'none';
        fechaTerapiaInputPair.style.display = 'none';
        escenarioInputPair.style.display = 'none';
        nombreTerapia.required = false;
        fechaTerapia.required = false;
        nombreTerapia.value = '';
        fechaTerapia.value = '';
        escenario.value = '';
      }
    });
}

function inicializarProgresion(){
  // tab5 - progresión
  var progSi = document.getElementById("progresion1");
  var progNo = document.getElementById("progresion2");
  var fechaProgresion = document.getElementById("fecha-prog");
  var fechaProg = document.getElementById("fechaProgresion");
  var primeraLinea = document.getElementById("primera-linea");
  var primeraLineaSi = document.getElementById("primeraLinea1");
  var primeraLineaNo = document.getElementById("primeraLinea2");
  var Tto1 = document.getElementById("nombre-tto1");
  var nombreTto1 = document.getElementById("nombreTto1");
  var segundaLinea = document.getElementById("segunda-linea");
  var segundaLineaSi = document.getElementById("segundaLinea1");
  var segundaLineaNo = document.getElementById("segundaLinea2");
  var Tto2 = document.getElementById("nombre-tto2");
  var nombreTto2 = document.getElementById("nombreTto2");

  fechaProgresion.style.display = 'none';
  primeraLinea.style.display = 'none';
  Tto1.style.display = 'none';
  segundaLinea.style.display = 'none';
  Tto2.style.display = 'none';

  progSi.addEventListener('change', function() {
    if (this.checked) {
      fechaProgresion.style.display = 'flex';
      primeraLinea.style.display = 'flex';
      fechaProgresion.required = true;
      primeraLineaSi.required = true;
    }
  });

  progNo.addEventListener('change', function() {
    if (this.checked) {
      fechaProgresion.style.display = 'none';
      primeraLinea.style.display = 'none';
      Tto1.style.display = 'none';
      segundaLinea.style.display = 'none';
      Tto2.style.display = 'none';
      fechaProgresion.required = false;
      primeraLineaSi.required = false;
      fechaProg.value = '';
      primeraLineaSi.checked = false;
      primeraLineaNo.checked = false;
      nombreTto1.value = '';
      segundaLineaSi.checked = false;
      segundaLineaNo.checked = false;
      nombreTto2.value = '';
    }
  });

  primeraLineaSi.addEventListener('change', function() {
    if (this.checked) {
      Tto1.style.display = 'flex';
      segundaLinea.style.display = 'flex';
      nombreTto1.required = true;
      segundaLineaSi.required = true;
    }
  });

  primeraLineaNo.addEventListener('change', function() {
    if (this.checked) {
      Tto1.style.display = 'none';
      segundaLinea.style.display = 'none';
      Tto2.style.display = 'none';
      nombreTto1.value = '';
      nombreTto1.required = false;
      segundaLineaSi.required = false;
      segundaLineaSi.checked = false;
      segundaLineaNo.checked = false;
      nombreTto2.value = '';
    }
  });

  segundaLineaSi.addEventListener('change', function() {
    if (this.checked) {
      Tto2.style.display = 'flex';
      nombreTto2.required = true;
    }
  });

  segundaLineaNo.addEventListener('change', function() {
    if (this.checked) {
      Tto2.style.display = 'none';
      nombreTto2.value = '';
      nombreTto2.required = false;
    }
  });
}

function inicializarEstadoVital(){
  const estadoVital = document.getElementById('estadoVital');
  const fechaMuerte = document.getElementById('fecha-muerte');
  const input = document.getElementById('fechaMuerte');

  fechaMuerte.style.display = 'none';

  estadoVital.addEventListener('change', function() {
    if (fechaMuerte.style.display = this.value === 'Muerto'){
      fechaMuerte.style.display = 'flex';
      document.getElementById("fechaMuerte").required = true;
    }
    else{
      fechaMuerte.style.display = 'none';
      document.getElementById("fechaMuerte").required = false;
      input.value = '';
    }
  });
}


  // Llamado a las funciones para desplegar el formulario según las opciones de radio
  inicializarBiomarcadores();
  inicializarTratamiento();
  inicializarProgresion();
  inicializarEstadoVital();