import { User, API_USERS } from './Usuario.js';
import { Room, API_ROOMS } from './Habitacion.js';
import { Reservation, API_RESERVATIONS } from './Reserva.js';
import { crearUsuario } from './Usuario.js';

export async function obtenerUsuarios() {
  try {
    const res = await fetch(API_USERS);
    const usuarios = await res.json();
    return usuarios.map(u => new User(u.id, u.nombre, u.email, u.password, u.role));
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
  }
}

export async function obtenerHabitaciones() {
  try {
    const res = await fetch(API_ROOMS);
    const rooms = await res.json();
    return rooms.map(h => new Room(h.id, h.tipo, h.precio, h.disponible));
  } catch (error) {
    console.error("Error al obtener habitaciones:", error);
  }
}

export async function obtenerReservas() {
  try {
    const res = await fetch(API_RESERVATIONS);
    const reservas = await res.json();
    return reservas.map(r => new Reservation(r.id, r.userId, r.roomId, r.checkIn, r.checkOut, r.estado));
  } catch (error) {
    console.error("Error al obtener reservas:", error);
  }
}

export async function loginUsuario(email, password) {
  try {
    const res = await fetch(API_USERS);
    const usuarios = await res.json();

    const usuario = usuarios.find(u => 
      u.email.trim().toLowerCase() === email.trim().toLowerCase() &&
      u.password === password
    );

    if (usuario) {
      console.log("Login exitoso:", usuario);

      // Guardar en localStorage
      localStorage.setItem("usuarioActivo", JSON.stringify(usuario));

      // Redirigir según el rol
      if (usuario.role === "ADMIN") {
        window.location.href = "../HTML/pantallaAdmin.html";
      } else {
        window.location.href = "../HTML/pantallaUsuario.html";
      }

      return usuario;
    } else {
      alert("Usuario o contraseña incorrectos");
      return null;
    }
  } catch (error) {
    console.error("Error en login:", error);
  }
}
//conexion funcion loginUsuario con boton
const botonLogin = document.getElementById("loginForm");

if (botonLogin) {
  botonLogin.addEventListener("submit", async (e) => {
    e.preventDefault();//le decimos que no recargue la pagina, se encarga el js

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
      alert("Por favor, completá todos los campos.");
      return;
    }

    // Llamamos directamente a la función que ya hace todo
    await loginUsuario(email, password);
  });
}
//conexion formulario registro con funcion crearUsuario
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Obtener valores de los inputs
    const nombre = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Por defecto le damos rol USER (podés cambiarlo si querés)
    const role = "USER";

    // Crear el usuario
    await crearUsuario(nombre, email, password, role);

    alert("✅ Usuario creado correctamente. Ahora podés iniciar sesión.");
    
    // Redirigir al login
    window.location.href = "/HTML/pantallaPrincipal.html";
  });
}






