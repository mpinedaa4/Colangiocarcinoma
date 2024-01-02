const loginForm = document.getElementById('login');

// Define el manejador de eventos una vez
function handleLoginResult(event, result) {   
    if (result == true) {
      window.electronAPI.openMainWin();
    } else if (result == false) {
      alert('Usuario y/o contraseña incorrecto(s)');
    }
  }
  
  // Lista de funciones de devolución de llamada
  const loginResultCallbacks = [];
  
  // Función para suscribirse al evento loginResult
  function subscribeToLoginResult() {
    loginResultCallbacks.push(handleLoginResult);
  }
  
  // Función para desuscribirse del evento loginResult
  function unsubscribeFromLoginResult() {
    const index = loginResultCallbacks.indexOf(handleLoginResult);
    if (index !== -1) {
      loginResultCallbacks.splice(index, 1);
    }
  }
  
  // Desuscribirse antes de que se envíe el formulario
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Evitar que el formulario se envíe de manera predeterminada
    
    const usuarioInput = document.getElementById('usuario');
    const passwordInput = document.getElementById('password');
    
    const usuario = usuarioInput.value;
    const password = passwordInput.value;
  
    unsubscribeFromLoginResult();
  
    window.electronAPI.validateLogin(usuario, password);
  
    // Simular la suscripción al evento, agregando el manejador directamente a la lista
    loginResultCallbacks.push(handleLoginResult);
  });
  
  // Al recibir el resultado, ejecutar todas las funciones de devolución de llamada
  function onLoginResultReceived(event, result) {
    for (const callback of loginResultCallbacks) {
      callback(event, result);
    }
  }
  
  // Suscribirse al evento loginResult (simulado)
  window.electronAPI.loginResult(onLoginResultReceived);
  
  

(function () {
  
  function init() { 
    document.getElementById("min-btn").addEventListener("click", function (e) {
      window.electronAPI.minimizarLogin();
    });
    
    document.getElementById("close-btn").addEventListener("click", function (e) {
      window.electronAPI.cerrarLogin();
    }); 
  }; 
  
  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      init(); 
    }
  };
})();

  