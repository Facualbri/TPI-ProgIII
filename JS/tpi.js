import { User, API_USERS } from './Usuario.js';
import { Room, API_ROOMS } from './Habitacion.js';
import { Reservation, API_RESERVATIONS } from './Reserva.js';
import { crearUsuario } from './Usuario.js';
import { crearReserva } from './Reserva.js';
import { roomsExtraData } from "./roomsExtraData.js";

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
export function controlarBotonCerrarSesion() {
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
export function ocultarYMostrarPass(idInput, idBoton) {
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

// ESTE DOM CONTIENE FUNCION CERRAR SESION, MANEJO BOTON CERRAR SESION Y BOTONES RESERVAR
document.addEventListener("DOMContentLoaded", () => {

  // FUNCIÓN CERRAR SESIÓN
  function cerrarSesion() {
    localStorage.removeItem("usuarioActivo");
    window.location.reload();
  }
  // MOSTRAR / OCULTAR BOTÓN CERRAR SESIÓN
  function controlarBotonCerrarSesion() {
    const btnCerrar = document.getElementById("btnCerrarSesion");
    const usuarioActivo = localStorage.getItem("usuarioActivo");

    if (!btnCerrar) return;

    if (usuarioActivo) {
      btnCerrar.style.display = "block";
    } else {
      btnCerrar.style.display = "none";
    }
  }

  // Se ejecuta al cargar la página
  controlarBotonCerrarSesion();

  // Conectar botón cerrar sesión
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", (e) => {
      e.preventDefault();
      cerrarSesion();
    });
  }
  // MANEJAR BOTONES "RESERVAR"
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-reservar")) {
      e.preventDefault();

      const usuarioActivo = localStorage.getItem("usuarioActivo");

      // ✔ Si NO hay sesión → login
      if (!usuarioActivo) {
        window.location.href = "/HTML/login.html";
        return;
      }

      // ✔ Si hay sesión → guardar datos habitación
      const roomData = e.target.getAttribute("data-room-details");

      if (!roomData) {
        alert("Error: No se encontraron los detalles de la habitación.");
        return;
      }

      localStorage.setItem("reservaTemporal", roomData);

      // Ir al carrito
      window.location.href = "/HTML/carrito.html";
    }
  });

  // ======================================================
  // 4️⃣ INICIALIZAR CARRITO (solo si estamos en carrito.html)
  // ======================================================
  const detallesContainer = document.getElementById("reservaDetalles");
  if (detallesContainer) {
    inicializarCarrito();
  }

});

// INICIALIZAR CARRITO — ESTA FUNCIÓN QUEDA FUERA DEL DOMCONTENTLOADED
export function inicializarCarrito() {

  const detallesContainer = document.getElementById("reservaDetalles");
  const reservaJson = localStorage.getItem("reservaTemporal");

  const checkInInput = document.getElementById("checkInDate");
  const nochesInput = document.getElementById("nroNochesInput");
  const checkOutSpan = document.getElementById("checkOutDate");
  const btnConfirmar = document.getElementById("btnConfirmarReserva");
  const estadoReservaSpan = document.getElementById("estadoReserva");

  if (!reservaJson) {
    detallesContainer.innerHTML = `
            <div class="alert alert-danger w-100">
                ERROR: No se encontraron detalles.
            </div>`;
    return;
  }

  const reserva = JSON.parse(reservaJson);
  let precioNoche = reserva.precio;
  const IMPUESTO_PORCENTAJE = 0.10;

  // FUNCIÓN PARA CALCULAR TOTAL + CHECKOUT
  function actualizarResumen() {
    const noches = parseInt(nochesInput.value) || 0;
    const checkInValue = checkInInput.value;

    // Calcular checkout
    let checkOutText = "Pendiente";
    if (checkInValue) {
      const checkIn = new Date(checkInValue);
      checkIn.setMinutes(checkIn.getMinutes() + checkIn.getTimezoneOffset());

      let checkOut = new Date(checkIn);
      checkOut.setDate(checkIn.getDate() + noches);

      const day = String(checkOut.getDate()).padStart(2, "0");
      const month = String(checkOut.getMonth() + 1).padStart(2, "0");
      const year = checkOut.getFullYear();

      checkOutText = `${day}/${month}/${year}`;
    }

    checkOutSpan.textContent = checkOutText;

    //guardar fechas y noches para el comprobante
    localStorage.setItem("checkInReserva", checkInValue);
    localStorage.setItem("checkOutReserva", checkOutText);
    localStorage.setItem("nochesReserva", noches);

    // Cálculo total
    const subtotal = precioNoche * noches;
    const impuestos = subtotal * IMPUESTO_PORCENTAJE;
    const total = subtotal + impuestos;

    document.getElementById("precioNoche").textContent = `$${precioNoche}`;
    document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("impuestos").textContent = `$${impuestos.toFixed(2)}`;
    document.getElementById("totalFinal").textContent = `$${total.toFixed(2)}`;
    document.getElementById("textoNoches").textContent = `${noches} noches`;

    btnConfirmar.disabled = !(checkInValue && noches > 0);
  }

  // CARGAR DETALLES DE HABITACIÓN
  detallesContainer.innerHTML = `
        <img src="${reserva.imagen}" class="rounded me-3" style="width: 100px; height: 80px;">
        <div>
            <h5>${reserva.nombre}</h5>
            <p class="text-muted">Ubicación: ${reserva.ubicacion}</p>
        </div>
    `;

  // EVENTOS PARA CALCULAR AUTOMÁTICO
  checkInInput.addEventListener("change", actualizarResumen);
  nochesInput.addEventListener("input", actualizarResumen);

  actualizarResumen();
}

//CONFIRMAR RESERVA
export async function confirmarReserva() {

  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
  const reserva = JSON.parse(localStorage.getItem("reservaTemporal"));

  if (!reserva) {
    alert("No se encontraron los datos de la habitación.");
    return;
  }

  const checkIn = localStorage.getItem("checkInReserva");
  const checkOut = localStorage.getItem("checkOutReserva");

  if (!checkIn || !checkOut || checkOut === "Pendiente") {
    alert("Completá correctamente las fechas.");
    return;
  }

  // Crear la reserva en la API
  const resultado = await crearReserva(
    usuarioActivo.id,
    reserva.id,
    checkIn,
    checkOut
  );

  if (!resultado) {
    alert("Error al confirmar");
    return;
  }

  // Marcar habitación como reservada en MockAPI
await fetch(`${API_ROOMS}/${reserva.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ disponible: false })
});

  // NO BORRAR AÚN LOS DATOS
  window.location.href = "/HTML/comprobante.html";
}

//ENLAZAR BOTON CONFIRMAR RESERVA
const btnConfirmar = document.getElementById("btnConfirmarReserva");
if (btnConfirmar) {
  btnConfirmar.addEventListener("click", async (e) => {
    e.preventDefault();
    await confirmarReserva();
  });
}

export function cargarComprobante() {
  // Intentamos recuperar la última reserva que debería haberse guardado tras la confirmación
  const reservaTemporalJson = localStorage.getItem("reservaTemporal");
  const usuarioActivoJson = localStorage.getItem("usuarioActivo");

  // NOTA: Para un uso real, la API debería devolver el comprobante al confirmar. 
  // Aquí simulamos que el carrito guardó los datos antes de eliminarlos.
  const reservaData = reservaTemporalJson ? JSON.parse(reservaTemporalJson) : null;
  const usuarioData = usuarioActivoJson ? JSON.parse(usuarioActivoJson) : null;

  // Si no tenemos datos, no podemos mostrar nada
  if (!reservaData || !usuarioData) {
    // Podrías redirigir al usuario o mostrar un mensaje de error
    const comprobanteCard = document.querySelector(".comprobante-card .card-body");
    if (comprobanteCard) comprobanteCard.innerHTML = `<div class="alert alert-danger text-center">No se pudo cargar la información de la reserva. Intente reservar nuevamente.</div>`;
    return;
  }

  // Calcular las fechas y precios nuevamente
  const nochesInput = localStorage.getItem("nochesReserva") || 1; // Necesitas guardar las noches en el carrito.js/tpi.js
  const checkIn = localStorage.getItem("checkInReserva");
  const checkOut = localStorage.getItem("checkOutReserva");

  const precioNoche = reservaData.precio;
  const noches = parseInt(nochesInput);
  const IMPUESTO_PORCENTAJE = 0.10;
  const subtotal = precioNoche * noches;
  const impuestos = subtotal * IMPUESTO_PORCENTAJE;
  const total = subtotal + impuestos;

  // Insertar datos del Huésped
  document.getElementById("huespedNombre").textContent = usuarioData.nombre;
  document.getElementById("huespedEmail").textContent = usuarioData.email;

  // Insertar Fechas y Noches
  document.getElementById("fechaCheckIn").textContent = checkIn;
  document.getElementById("fechaCheckOut").textContent = checkOut;
  document.getElementById("totalNoches").textContent = noches;
  document.getElementById("numNoches").textContent = noches; // En el resumen de pagos

  // Insertar Detalles de la Habitación
  document.getElementById("roomImage").src = reservaData.imagen;
  document.getElementById("roomName").textContent = reservaData.nombre;
  document.getElementById("roomLocation").textContent = `${reservaData.ubicacion}`;
  document.getElementById("roomType").textContent = `${reservaData.tipo}`;

  // Insertar Resumen de Pagos
  document.getElementById("precioNoche").textContent = `$${precioNoche.toFixed(2)}`;
  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("impuestos").textContent = `$${impuestos.toFixed(2)}`;
  document.getElementById("totalFinal").textContent = `$${total.toFixed(2)}`;

  // Número de comprobante (simulado)
  document.getElementById("nroComprobante").textContent = `Ref: #LDH-${Math.floor(Math.random() * 900000) + 100000}`;

  // Enlazar botón Imprimir
  const btnPrint = document.getElementById("btnPrintComprobante");
  if (btnPrint) {
    btnPrint.addEventListener("click", () => {
      window.print();
    });
  }

}

// Llamar a cargarComprobante si estamos en esa página
document.addEventListener("DOMContentLoaded", () => {
  // ... (Tu código actual de DOMContentLoaded)

  // Añadir esta nueva sección:
  const comprobanteCard = document.querySelector(".comprobante-card");
  if (comprobanteCard) {
    cargarComprobante();
  }
});

export async function cargarHabitaciones() {
  const container = document.getElementById("roomContainer");
  if (!container) return;

  container.innerHTML = "<p>Cargando habitaciones...</p>";

  // ⏳ Esperar 2 segundos antes de cargar
  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    const res = await fetch(API_ROOMS);
    const rooms = await res.json();

    container.innerHTML = ""; // limpiar

    rooms.forEach(room => {

      const extra = roomsExtraData[room.id];

      if (!extra) {
        console.warn("No hay datos extra para room:", room.id);
        return;
      }

      const disponibleTexto = room.disponible ? 
        `<span class="text-success fw-bold">Disponible</span>` :
        `<span class="text-danger fw-bold">Reservada</span>`;

      const boton =
        room.disponible
          ? `<a href="#" class="btn btn-sm btn-primary btn-reservar"
               data-room-details='${JSON.stringify({
                 id: room.id,
                 nombre: extra.nombre,
                 ubicacion: extra.ubicacion,
                 precio: room.precio,
                 imagen: extra.imagen,
                 tipo: room.tipo
               })}'>
               Reservar
             </a>`
          : `<button class="btn btn-sm btn-secondary" disabled>Ocupada</button>`;

      // CARD HTML FINAL
      const card = `
        <div class="col-md-6 col-lg-4 mb-4">
          <div class="card offer-card shadow-sm h-100">
            <img src="${extra.imagen}" class="card-img-top">
            <div class="card-body d-flex flex-column">
              
              <h5 class="card-title text-success">${extra.nombre}</h5>
              <h6 class="card-subtitle mb-2 text-muted">
                <i class="bi bi-geo-alt-fill"></i> ${extra.ubicacion}
              </h6>

              <p class="card-text flex-grow-1">${extra.descripcion}</p>

              <ul class="list-unstyled small mb-3">
                <li><strong>Tipo:</strong> ${room.tipo}</li>
                <li><strong>Disponibilidad:</strong> ${disponibleTexto}</li>
              </ul>

              <div class="d-flex justify-content-between align-items-center mt-auto">
                <span class="badge bg-success fs-6">Desde $${room.precio} / noche</span>
                ${boton}
              </div>

            </div>
          </div>
        </div>
      `;

      container.innerHTML += card;
    });

  } catch (err) {
    console.error("Error cargando habitaciones:", err);
    container.innerHTML = "<p>Error al cargar habitaciones.</p>";
  }
}

document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("roomContainer");

  if (container) {
    cargarHabitaciones();
  }

});

export async function mostrarReservasUsuario() {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    const container = document.getElementById("reservasContainer");
    const sinMsg = document.getElementById("sinReservasMsg");

    if (!usuarioActivo || !container) return;

    try {
        // 1. Obtener TODAS las reservas
        const res = await fetch(API_RESERVATIONS);
        const reservas = await res.json();

        // 2. Filtrar las del usuario activo
        const misReservas = reservas.filter(r => r.userId == usuarioActivo.id);

        // 3. Si no tiene reservas → mostrar mensaje
        if (misReservas.length === 0) {
            sinMsg.classList.remove("d-none");
            return;
        }

        // 4. Obtener habitaciones para poder mostrar datos
        const roomsRes = await fetch(API_ROOMS);
        const rooms = await roomsRes.json();

        container.innerHTML = "";

        // 5. Renderizar cada reserva
        misReservas.forEach(reserva => {

            const room = rooms.find(r => r.id == reserva.roomId);
            if (!room) return;

            container.innerHTML += `
                <div class="col-md-6">
                    <div class="card shadow-sm">

                        <div class="card-body">

                            <h5 class="card-title">Reserva #${reserva.id}</h5>
                            <p><strong>Habitación:</strong> ${room.tipo}</p>
                            <p><strong>Check-In:</strong> ${reserva.checkIn}</p>
                            <p><strong>Check-Out:</strong> ${reserva.checkOut}</p>
                            <p><strong>Estado:</strong> 
                                <span class="badge bg-${reserva.estado === "CANCELADA" ? "danger" : "success"}">
                                    ${reserva.estado}
                                </span>
                            </p>

                            ${reserva.estado !== "CANCELADA"
                                ? `<button class="btn btn-danger btn-cancelar" data-id="${reserva.id}" data-room="${room.id}">
                                        Cancelar Reserva
                                   </button>`
                                : `<button class="btn btn-secondary" disabled>Cancelada</button>`
                            }

                        </div>

                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error("Error cargando reservas:", error);
    }
}

export async function cancelarReserva(idReserva, idRoom) {
    try {
        // 1. Marcar reserva como cancelada
        await fetch(`${API_RESERVATIONS}/${idReserva}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado: "CANCELADA" })
        });

        // 2. Liberar la habitación
        await fetch(`${API_ROOMS}/${idRoom}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ disponible: true })
        });

        alert("Reserva cancelada correctamente.");
        location.reload();

    } catch (error) {
        alert("Error al cancelar la reserva.");
        console.error(error);
    }
}
//CONEXION BOTONES CANCELAR RESERVA
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-cancelar")) {
        const idReserva = e.target.getAttribute("data-id");
        const idRoom = e.target.getAttribute("data-room");

        cancelarReserva(idReserva, idRoom);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const reservasContainer = document.getElementById("reservasContainer");
    if (reservasContainer) {
        mostrarReservasUsuario();
    }
});
