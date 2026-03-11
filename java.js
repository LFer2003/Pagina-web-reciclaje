// Simula si el usuario está logueado (false por defecto)
let usuarioLogueado = localStorage.getItem("logueado") === "true";

// Lógica del botón Comprar
function comprarProducto() {
  if (usuarioLogueado) {
    alert("Producto agregado al carrito ✅");
  } else {
    alert("Debes iniciar sesión para comprar 🛑");
    window.location.href = "login.html"; // Redirige a login
  }
}

// Simulación del login (por ejemplo, cuando el usuario inicia sesión)
function iniciarSesion() {
  localStorage.setItem("logueado", "true");
  alert("¡Has iniciado sesión!");
}

// Simulación del logout
function cerrarSesion() {
  localStorage.setItem("logueado", "false");
  alert("Has cerrado sesión");
}


