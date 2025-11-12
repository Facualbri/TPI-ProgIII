
async function obtenerUsuarios() {
  try {
    const res = await fetch(API_USERS);
    const data = await res.json();
    const usuarios = data.map(u => new User(u.id, u.nombre, u.email, u.password, u.role));
    console.log("Usuarios cargados:", usuarios);
    return usuarios;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
  }
}

async function obtenerHabitaciones() {
  try {
    const res = await fetch(API_ROOMS);
    const data = await res.json();
    const habitaciones = data.map(h => new Room(h.id, h.tipo, h.precio, h.disponible));
    console.log("Habitaciones cargadas:", habitaciones);
    return habitaciones;
  } catch (error) {
    console.error("Error al obtener habitaciones:", error);
  }
}

async function obtenerReservas() {
  try {
    const res = await fetch(API_RESERVATIONS);
    const data = await res.json();
    const reservas = data.map(r => new Reservation(r.id, r.userId, r.roomId, r.checkIn, r.checkOut, r.estado));
    console.log("Reservas cargadas:", reservas);
    return reservas;
  } catch (error) {
    console.error("Error al obtener reservas:", error);
  }
}

async function registrarUsuario(nombre, email, password, role = "cliente") {
  try {
    const nuevoUsuario = { nombre, email, password, role };
    const res = await fetch(API_USERS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoUsuario)
    });
    
    const data = await res.json();
    console.log("Usuario registrado:", data);
    return data;
  } catch (error) {
    console.error("Error al registrar usuario:", error);
  }
}
async function loginUsuario(email, password) {
  try {
    const data = await fetch(API_USERS);
    const usuarios = await data.json();

    const usuario = usuarios.find(u => u.email === email && u.password === password);

    if (usuario) {
      console.log("Login exitoso:", usuario);
      return usuario;
    } else {
      console.warn("Usuario o contraseña incorrectos");
      return null;
    }
  } catch (error) {
    console.error("Error en login:", error);
  }
}

// ==========================
// PRUEBAS DE LOGIN Y REGISTRO
// ==========================

// 1 Registrar un nuevo usuario
//registrarUsuario("Mariano", "mariano@example.com", "123456", "cliente");

// 2 Probar login con un usuario ya creado
// loginUsuario("mariano@example.com", "123456");
