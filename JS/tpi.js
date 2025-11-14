import { User, API_USERS } from './Usuario.js';
import { Room, API_ROOMS } from './Habitacion.js';
import { Reservation, API_RESERVATIONS } from './Reserva.js';
import { crearUsuario } from './Usuario.js';
import { crearReserva } from './Reserva.js';

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
    const password = document.getElementById("passwordLogin").value;

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
    const password = document.getElementById("passwordRegister").value;

    // Por defecto le damos rol USER (podés cambiarlo si querés)
    const role = "USER";

    // Crear el usuario
    await crearUsuario(nombre, email, password, role);

    alert("✅ Usuario creado correctamente. Ahora podés iniciar sesión.");
    
    // Redirigir al login
    window.location.href = "/HTML/login.html";
  });
}
export function cerrarSesion() {
  // borrar usuario en localStorage
  localStorage.removeItem("usuarioActivo");

  // redirigir a pantallaPrincipal
  window.location.href = "/HTML/pantallausuario.html";
}

// Función para mostrar/ocultar el botón "Cerrar Sesión"
function controlarBotonCerrarSesion() {
    const btnCerrar = document.getElementById("btnCerrarSesion");
    const usuarioActivo = localStorage.getItem("usuarioActivo");

    if (btnCerrar) {
        // Si hay un usuario en localStorage (sesión iniciada)
        if (usuarioActivo) {
            btnCerrar.style.display = 'block'; // Muestra el botón
        } else {
            btnCerrar.style.display = 'none'; // Oculta el botón
        }
    }
}
// Controlar el botón de cerrar sesión al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    // Si el elemento roomContainer existe (estamos en pantallaUsuario), ejecutar ambas lógicas
    if (document.getElementById("roomContainer")) {
        manejarReserva(); // Maneja la lógica de clic en reservar (con verificación de login)
        controlarBotonCerrarSesion(); // Controla la visibilidad del botón de cerrar sesión
    }
});
//conexion boton cerrar sesion con funcion cerrarSesion
const btnCerrar = document.getElementById("btnCerrarSesion");
// El código para la conexión del botón "Cerrar Sesión" debe mantenerse:
if (btnCerrar) {
    btnCerrar.addEventListener("click", (e) => {
        e.preventDefault();
        cerrarSesion();
    });
}

// ocular/mostrar contraseña en pantallaprincipal y registro
function ocultarYMostrarPass(idInput, idBoton) {
  const input = document.getElementById(idInput);
  const boton = document.getElementById(idBoton);

  if (!input || !boton) return; // Si no existe en esta página, no hace nada

  const icon = boton.querySelector("i");

  boton.addEventListener("click", () => {
    if (input.type === "password") {
      input.type = "text";
      icon.classList.replace("bi-eye", "bi-eye-slash");
      boton.setAttribute("aria-label", "Ocultar contraseña");
    } else {
      input.type = "password";
      icon.classList.replace("bi-eye-slash", "bi-eye");
      boton.setAttribute("aria-label", "Mostrar contraseña");
    }
  });
}
//activa en cada formulario
  ocultarYMostrarPass("passwordRegister", "ocultarPassRegister");
  ocultarYMostrarPass("passwordLogin", "ocultarPassLogin");

// Este código debe estar en el cuerpo principal de tpi.js,
// cerca de tus otras funciones como loginUsuario o cerrarSesion.

// Función de manejo del click en los botones de "Reservar" (pantallaUsuario.html)
function manejarReserva() {
    const botonesReservar = document.querySelectorAll(".btn-reservar");

    botonesReservar.forEach(boton => {
        boton.addEventListener("click", (e) => {
            e.preventDefault();

            const usuarioActivo = localStorage.getItem("usuarioActivo");

            if (!usuarioActivo) {
                alert("Debes iniciar sesión para realizar una reserva.");
                window.location.href = "../HTML/login.html"; 
                return;
            }

            const roomDetailsJson = boton.getAttribute("data-room-details");
            
            if (roomDetailsJson) {
                const roomDetails = JSON.parse(roomDetailsJson);
                
                // Guardar los detalles en localStorage para que carrito.html los recupere
                localStorage.setItem("reservaTemporal", JSON.stringify(roomDetails));

                window.location.href = "../HTML/carrito.html";
            } else {
                alert("Error: No se encontraron los detalles de la habitación.");
            }
        });
    });
}

// ----------------------------------------------------

// Función de inicialización del Carrito (carrito.html)
export function inicializarCarrito() {
    const detallesContainer = document.getElementById('reservaDetalles');
    
    if (!detallesContainer) {
        return; // Sale si no estamos en carrito.html
    }

    const reservaJson = localStorage.getItem('reservaTemporal');
    const checkInInput = document.getElementById('checkInDate');
    const nochesInput = document.getElementById('nroNochesInput');
    const checkOutSpan = document.getElementById('checkOutDate');
    const btnConfirmar = document.getElementById('btnConfirmarReserva');
    const estadoReservaSpan = document.getElementById('estadoReserva');

    let precioNoche = 0;
    const IMPUESTO_PORCENTAJE = 0.10; // 10% de impuestos
    
    // --- FUNCIÓN DE CÁLCULO Y ACTUALIZACIÓN EN TIEMPO REAL ---
    const actualizarResumen = () => {
        const noches = parseInt(nochesInput.value) || 0;
        const checkInValue = checkInInput.value;
        
        // 1. Manejo y Cálculo de Fechas
        let checkOutText = 'Pendiente';
        if (checkInValue) {
            const checkIn = new Date(checkInValue);
            checkIn.setMinutes(checkIn.getMinutes() + checkIn.getTimezoneOffset());
            
            let checkOut = new Date(checkIn);
            checkOut.setDate(checkIn.getDate() + noches);
            
            const day = String(checkOut.getDate()).padStart(2, '0');
            const month = String(checkOut.getMonth() + 1).padStart(2, '0');
            const year = checkOut.getFullYear();
            checkOutText = `${day}/${month}/${year}`;
        }
        checkOutSpan.textContent = checkOutText;

        // 2. CÁLCULO DE COSTOS
        // Si noches es 0 o precio es 0, los totales serán 0.
        const subtotal = precioNoche * noches;
        const impuestos = subtotal * IMPUESTO_PORCENTAJE;
        const totalFinal = subtotal + impuestos;
        
        // 3. ACTUALIZAR INTERFAZ
        document.getElementById('nroNoches').textContent = noches;
        document.getElementById('textoNoches').textContent = `${noches} noches`;
        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('impuestos').textContent = `$${impuestos.toFixed(2)}`;
        document.getElementById('totalFinal').textContent = `$${totalFinal.toFixed(2)}`;

        // Habilitar botón de confirmación
        btnConfirmar.disabled = !(checkInInput.value && noches > 0 && precioNoche > 0);
    };
    
    // --- LÓGICA DE ENVÍO A LA API ---
    const confirmarReservaYEnviar = async () => {
        const noches = parseInt(nochesInput.value);
        const checkInDate = checkInInput.value;
        const checkOutDateText = checkOutSpan.textContent;
        const reserva = JSON.parse(localStorage.getItem('reservaTemporal'));
        const totalFinalText = document.getElementById('totalFinal').textContent;

        if (noches <= 0 || !checkInDate || !reserva) {
            alert('🚨 Por favor, completa la fecha de Check-in y la cantidad de noches.');
            return;
        }
        
        const usuarioActivo = localStorage.getItem("usuarioActivo");
        if (!usuarioActivo) {
            alert("🚨 Debes iniciar sesión para confirmar la reserva.");
            return;
        }
        
        const userId = JSON.parse(usuarioActivo).id;

        const nuevaReserva = {
            userId: userId, 
            roomId: reserva.id,
            checkIn: checkInDate,
            checkOut: checkOutDateText, 
            noches: noches,
            precioTotal: parseFloat(totalFinalText.replace('$', '')),
            estado: 'CONFIRMADA'
        };

        btnConfirmar.disabled = true; 
        
        // Llama a la función modular (asumiendo que crearReserva está importada de Reserva.js)
        const resultado = await crearReserva(nuevaReserva);

        if (resultado.success) {
            localStorage.removeItem('reservaTemporal'); 
            
            estadoReservaSpan.textContent = 'CONFIRMADA';
            estadoReservaSpan.className = 'fw-bold text-success';
            
            alert(`✅ ¡Reserva CONFIRMADA! ID: ${resultado.data.id || 'N/A'}`);
        } else {
            alert(`❌ Error al confirmar: ${resultado.message}`);
            btnConfirmar.disabled = false;
        }
    };


    // --- INICIALIZACIÓN DE DATOS Y CONEXIÓN DE EVENTOS ---
    if (reservaJson) {
        const reserva = JSON.parse(reservaJson);
        precioNoche = reserva.precio; 
        
        document.getElementById('precioNoche').textContent = `$${precioNoche.toFixed(2)}`;

        // Renderizar detalles de la habitación (Carga de detalles)
        detallesContainer.innerHTML = `
            <img src="${reserva.imagen}" alt="Imagen del Hotel" class="rounded me-3" style="width: 100px; height: 80px; object-fit: cover;">
            <div>
                <h5 class="mb-1">${reserva.nombre}</h5>
                <p class="text-muted mb-0">Hotel: La Hoja Dorada | Ubicación: ${reserva.ubicacion}</p>
            </div>
        `;

        // 1. CONEXIÓN PARA EL CÁLCULO EN TIEMPO REAL
        checkInInput.addEventListener('change', actualizarResumen);
        nochesInput.addEventListener('input', actualizarResumen);
        nochesInput.addEventListener('keyup', actualizarResumen); 
        
        // 2. Conexión del botón Confirmar
        btnConfirmar.addEventListener('click', confirmarReservaYEnviar);

        // Ejecutar el cálculo inicial al cargar
        actualizarResumen();

    } else {
        detallesContainer.innerHTML = `
            <div class="alert alert-danger w-100" role="alert">
                ❌ ERROR: No se encontraron detalles.
            </div>
        `;
        btnConfirmar.disabled = true;
    }
}