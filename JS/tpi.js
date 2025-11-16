import { User, API_USERS } from './Usuario.js';
import { Room, API_ROOMS } from './Habitacion.js';
import { Reservation, API_RESERVATIONS } from './Reserva.js';
import { crearUsuario } from './Usuario.js';
import { crearReserva } from './Reserva.js';
import { roomsExtraData } from "./roomsExtraData.js";
//TRAER DATOS DESDE MOCKAPI
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
//PROTEGER PANTALLA USUARIO
export function protegerPantallaUsuario() {
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

  // Si es admin NO puede ver pantallaUsuario
  if (usuario && usuario.role && usuario.role.toUpperCase() === "ADMIN") {
    window.location.href = "../HTML/login.html";
    return;
  }

  // SI NO HAY USUARIO → permitir ver la página como invitado
  // (solo ocultamos botones desde otra función)
}
//LOGIN
export async function loginUsuario(email, password) {
  try {
    // ✔ ADMIN HARDCODEADO
    if (email.trim().toLowerCase() === "admin@hotel.com" && password === "admin123") {

      const adminUser = {
        id: "ADMIN",
        nombre: "Administrador",
        email: "admin@hotel.com",
        role: "ADMIN"
      };

      // guardamos al admin en localStorage
      localStorage.setItem("usuarioActivo", JSON.stringify(adminUser));

      // redirigir al admin
      window.location.href = "../HTML/pantallaAdmin.html";
      return adminUser;
    }

    // ✔ SI NO ES ADMIN → validación normal en MockAPI
    const res = await fetch(API_USERS);
    const usuarios = await res.json();

    const usuario = usuarios.find(u =>
      u.email.trim().toLowerCase() === email.trim().toLowerCase() &&
      u.password === password
    );

    if (!usuario) {
      alert("Usuario o contraseña incorrectos");
      return null;
    }

    // Guardar en localStorage
    localStorage.setItem("usuarioActivo", JSON.stringify(usuario));

    // Redirigir según el rol (por si más adelante hay admin en la API)
    if (usuario.role === "ADMIN") {
      window.location.href = "../HTML/pantallaAdmin.html";
    } else {
      window.location.href = "../HTML/pantallausuario.html";
    }

    return usuario;

  } catch (error) {
    console.error("Error en login:", error);
    alert("Error al iniciar sesión.");
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

//CONEXION FORMULARIO CON FUNCION crearUsuario(esta en Usuario.js)
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
    window.location.href = "../HTML/login.html";
  });
}

//CERRAR SESION GENERAL
export function cerrarSesion() {
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

  // borrar siempre
  localStorage.removeItem("usuarioActivo");

  // si era admin → login
  if (usuario && usuario.role && usuario.role.toUpperCase() === "ADMIN") {
    window.location.href = "../HTML/login.html";
    return;
  }

  // si era usuario común → pantallaUsuario como invitado
  window.location.href = "../HTML/pantallausuario.html";
}

// Función para mostrar/ocultar el botón "Cerrar Sesión"
export function controlarBotonCerrarSesion() {
  const btnCerrar = document.getElementById("btnCerrarSesion");
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

  if (!btnCerrar) return;

  //Si NO hay usuario NO mostrar botón
  if (!usuario) {
    btnCerrar.style.display = "none";
    return;
  }

  //Si es admin → NO mostrar botón
  if (usuario.role && usuario.role.toUpperCase() === "ADMIN") {
    btnCerrar.style.display = "none";
    return;
  }

  // ✔ Si es usuario normal → mostrar botón
  btnCerrar.style.display = "block";
}

//conexion boton cerrar sesion con funcion cerrarSesion
const btnCerrar = document.getElementById("btnCerrarSesion");
if (btnCerrar) {
  btnCerrar.addEventListener("click", (e) => {
    e.preventDefault();
    cerrarSesion();
  });
}

// ocultar/mostrar contraseña en login y registro
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
  // MOSTRAR U OCULTAR BOTÓN CERRAR SESIÓN
  // Solo si estamos en pantallausuario.html
  if (window.location.pathname.includes("pantallausuario.html")) {
    if (typeof controlarBotonCerrarSesion === "function") {
      controlarBotonCerrarSesion();
    }
  }

  // MANEJAR BOTONES "RESERVAR"

  document.addEventListener("click", (e) => {

    // Captura el botón real aunque hagas click en el icono o texto
    const boton = e.target.closest(".btn-reservar");
    if (!boton) return;

    e.preventDefault();

    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    // Si NO hay sesión → ir al login
    if (!usuarioActivo) {
      window.location.href = "../HTML/login.html";
      return;
    }

    // Hay sesión → obtener data-room-details
    const roomData = boton.getAttribute("data-room-details");

    if (!roomData) {
      alert("Error: No se encontraron los detalles de la habitación.");
      return;
    }

    // Guardamos datos de la reserva temporal
    localStorage.setItem("reservaTemporal", roomData);

    // Ir al carrito
    window.location.href = "../HTML/carrito.html";
  });

  // ======================================
  // INICIALIZAR CARRITO (solo si aplica)
  // ======================================
  const detallesContainer = document.getElementById("reservaDetalles");
  if (detallesContainer && typeof inicializarCarrito === "function") {
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
  window.location.href = "../HTML/comprobante.html";
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

  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    const res = await fetch(API_ROOMS);
    const rooms = await res.json();

    // 🔥 Mezclar roomsExtraData original + localStorage
    const extrasLocal = JSON.parse(localStorage.getItem("roomsExtraData")) || {};
    const extras = { ...roomsExtraData, ...extrasLocal };

    container.innerHTML = "";

    rooms.forEach(room => {

      const extra = extras[room.id];

      if (!extra) {
        console.warn("No hay datos extra para room:", room.id);
        return;
      }

      const disponibleTexto = room.disponible
        ? `<span class="text-success fw-bold">Disponible</span>`
        : `<span class="text-danger fw-bold">Reservada</span>`;

      
      const boton =
        room.disponible
          ? `
            <button 
              class="btn btn-sm btn-primary btn-reservar"
              data-room-details='${JSON.stringify({
                id: room.id,
                nombre: extra.nombre,
                ubicacion: extra.ubicacion,
                precio: room.precio,
                imagen: extra.imagen,
                tipo: room.tipo
              })}'
            >
              Reservar
            </button>
          `
          : `<button class="btn btn-sm btn-secondary" disabled>Ocupada</button>`;

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

//CONEXION CARGAR HABITACIONES AL INICIAR PANTALLA USUARIo
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

// FUNCION DE ADMIN
export async function publicarHabitacion(event) {
  event.preventDefault();

  const form = document.getElementById("addRoomForm");
  if (!form) return;

  const nombre = document.getElementById("roomName").value;
  const descripcion = document.getElementById("roomDescription").value;
  const tipo = document.getElementById("roomType").value;
  const precio = Number(document.getElementById("roomPrice").value);

  const imagenFile = document.getElementById("roomImage").files[0];

  if (!imagenFile) {
    alert("Subí una imagen.");
    return;
  }

  // ⛔ NADA DE BASE64
  // ✔ URL temporal súper liviana
  const imagenUrl = URL.createObjectURL(imagenFile);

  // Obtener habitaciones existentes desde MockAPI
  const res = await fetch(API_ROOMS);
  const rooms = await res.json();
  const newId = String(rooms.length + 1);

  // Guardar en MockAPI
  await fetch(API_ROOMS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: newId,
      tipo,
      precio,
      disponible: true
    })
  });

  // Guardar extras en localStorage
  const extrasLocal = JSON.parse(localStorage.getItem("roomsExtraData")) || {};

  extrasLocal[newId] = {
    nombre,
    descripcion,
    ubicacion: "Misiones",
    imagen: imagenUrl
  };

  localStorage.setItem("roomsExtraData", JSON.stringify(extrasLocal));

  alert("Habitación agregada con éxito.");

  form.reset();

  localStorage.setItem("refreshRooms", "true");

  // Refrescar si existe la función
  if (typeof cargarHabitaciones === "function") {
    cargarHabitaciones();
  }
}


//CONEXION FORMULARIO PUBLICAR HABITACION
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addRoomForm");

  console.log("¿Se encontró el formulario?", form);

  if (form) {
    console.log("✔ Listener conectado al form");
    form.addEventListener("submit", publicarHabitacion);
  } else {
    console.log("❌ NO se encontró el formulario addRoomForm");
  }
});


//REVISA SI EXISTEN CONTENEDORES PARA NO ROMPER NADA
document.addEventListener("DOMContentLoaded", () => {
  cargarHabitacionesAdmin();
});

export async function cargarHabitacionesAdmin() {
  const container = document.getElementById("listaHabitaciones");
  if (!container) return;

  container.innerHTML = "<p>Cargando habitaciones...</p>";

  try {
    const res = await fetch(API_ROOMS);
    const rooms = await res.json();

    // Mezclar extras
    const extrasLocal = JSON.parse(localStorage.getItem("roomsExtraData")) || {};
    const extras = { ...roomsExtraData, ...extrasLocal };

    container.innerHTML = "";

    rooms.forEach(room => {
      const extra = extras[room.id];
      if (!extra) return;

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
                <li><strong>Disponibilidad:</strong> 
                    ${room.disponible
          ? '<span class="text-success fw-bold">Disponible</span>'
          : '<span class="text-danger fw-bold">Reservada</span>'
        }
                </li>
            </ul>

            <div class="d-flex justify-content-between align-items-center mt-auto">

                <span class="badge bg-success fs-6">
                    $${room.precio} / noche
                </span>

                <div class="d-flex gap-2">

                    <button class="btn btn-warning btn-sm btn-edit-room"
                            data-id="${room.id}">
                        <span data-id="${room.id}">
                            <i class="bi bi-pencil-square" data-id="${room.id}"></i>
                        </span>
                    </button>

                    <!-- BOTÓN ELIMINAR (mismo fix aplicado) -->
                    <button class="btn btn-danger btn-sm btn-delete-room"
                            data-id="${room.id}">
                        <span data-id="${room.id}">
                            <i class="bi bi-trash3" data-id="${room.id}"></i>
                        </span>
                    </button>

                </div>

            </div>

        </div>
    </div>
</div>
`;


      container.innerHTML += card;
    });

  } catch (err) {
    console.error("Error cargando habitaciones admin:", err);
    container.innerHTML = "<p>Error al cargar habitaciones.</p>";
  }
}

//EDITAR HABITACION
export async function editarHabitacion(id) {

  // 1. Traer datos desde la API
  const res = await fetch(`${API_ROOMS}/${id}`);
  const room = await res.json();

  // 2. Traer extras desde localStorage / diccionario
  const extrasLocal = JSON.parse(localStorage.getItem("roomsExtraData")) || {};
  const extras = { ...roomsExtraData, ...extrasLocal };
  const extra = extras[id];

  // 3. Completar modal
  document.getElementById("editId").value = id;
  document.getElementById("editNombre").value = extra.nombre;
  document.getElementById("editDescripcion").value = extra.descripcion;
  document.getElementById("editUbicacion").value = extra.ubicacion;
  document.getElementById("editTipo").value = room.tipo;
  document.getElementById("editPrecio").value = room.precio;
  document.getElementById("editImagenUrl").value = extra.imagen;

  // 4. Mostrar modal
  const modal = new bootstrap.Modal(document.getElementById("modalEditarHabitacion"));
  modal.show();
}

//GUARDAR CAMBIOS HABITACION EDITADA
export async function guardarCambiosHabitacion() {
  const id = document.getElementById("editId").value;

  // Valores de la API
  const tipo = document.getElementById("editTipo").value;
  const precio = Number(document.getElementById("editPrecio").value);

  // Valores del extra data
  const nombre = document.getElementById("editNombre").value;
  const descripcion = document.getElementById("editDescripcion").value;
  const ubicacion = document.getElementById("editUbicacion").value;

  const imagenUrlInput = document.getElementById("editImagenUrl").value;
  const imagenFile = document.getElementById("editImagenFile").files[0];

  // Paso 1 → Traer extras actuales
  const extrasLocal = JSON.parse(localStorage.getItem("roomsExtraData")) || {};
  const extraActual = extrasLocal[id];

  let imagenFinal = extraActual?.imagen || ""; // por defecto mantiene la actual

  // Si hay file → generar URL
  if (imagenFile) {
    imagenFinal = URL.createObjectURL(imagenFile);
  }
  else if (imagenUrlInput.trim() !== "") {
    imagenFinal = imagenUrlInput; // si el user puso una URL manual
  }

  // Paso 2 → Actualizar la API
  await fetch(`${API_ROOMS}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      tipo,
      precio,
      disponible: true
    })
  });

  // Paso 3 → Guardar extra data editado
  extrasLocal[id] = {
    nombre,
    descripcion,
    ubicacion,
    imagen: imagenFinal
  };

  localStorage.setItem("roomsExtraData", JSON.stringify(extrasLocal));

  // Aviso a pantallaUsuario
  localStorage.setItem("refreshRooms", "true");

  alert("Habitación actualizada con éxito.");

  // Refrescar lista admin
  if (typeof cargarHabitacionesAdmin === "function") {
    cargarHabitacionesAdmin();
  }

  // Cerrar el modal
  bootstrap.Modal.getInstance(document.getElementById("modalEditarHabitacion")).hide();
}

document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-edit-room");
    if (!btn) return;

    editarHabitacion(btn.dataset.id);
});

//CONEXION BOTON GUARDAR CAMBIOS
const btnGuardar = document.getElementById("btnGuardarCambios");
if (btnGuardar) {
  btnGuardar.addEventListener("click", guardarCambiosHabitacion);
}
//ELIMINAR HABITACION
export async function eliminarHabitacion(id) {

  // Confirmación
  const ok = confirm("¿Seguro que querés eliminar esta habitación? Esta acción no se puede deshacer.");
  if (!ok) return;

  try {

    // ===============================
    // 1. ELIMINAR DE MOCKAPI
    // ===============================
    await fetch(`${API_ROOMS}/${id}`, {
      method: "DELETE"
    });

    // ===============================
    // 2. ELIMINAR DE LOCALSTORAGE
    // ===============================

    const extrasLocal = JSON.parse(localStorage.getItem("roomsExtraData")) || {};

    delete extrasLocal[id];

    localStorage.setItem("roomsExtraData", JSON.stringify(extrasLocal));

    // ===============================
    // 3. NOTIFICAR A PANTALLAUSUARIO
    // ===============================
    localStorage.setItem("refreshRooms", "true");

    // ===============================
    // 4. ALERTA
    // ===============================
    alert("Habitación eliminada con éxito.");

    // ===============================
    // 5. RECARGAR LISTA ADMIN
    // ===============================
    if (typeof cargarHabitacionesAdmin === "function") {
      cargarHabitacionesAdmin();
    }

  } catch (err) {
    console.error("Error al eliminar habitación:", err);
    alert("Ocurrió un error al eliminar la habitación.");
  }
}
// CONEXIÓN BOTÓN ELIMINAR HABITACIÓN
document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-delete-room");
    if (!btn) return;

    eliminarHabitacion(btn.dataset.id);
});





