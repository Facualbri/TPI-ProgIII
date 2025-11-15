export const API_RESERVATIONS = 'https://6913a9c3f34a2ff1170ccab7.mockapi.io/api/v1/reservations';

export class Reservation {
  constructor(id, userId, roomId, checkIn, checkOut, estado) {
    this.id = id;
    this.userId = userId;
    this.roomId = roomId;
    this.checkIn = checkIn;
    this.checkOut = checkOut;
    this.estado = estado;
  }

  cancelar() {
    this.estado = "cancelada";
  }

  confirmar() {
    this.estado = "confirmada";
  }
}

export async function crearReserva(userId, roomId, checkIn, checkOut) {

  // Crear un objeto de la clase Reservation
  const nuevaReserva = new Reservation(
    null,          // id → lo genera MockAPI automáticamente
    userId,
    roomId,
    checkIn,
    checkOut,
    "CONFIRMADA"   // estado fijo
  );

  try {

    // Enviar el objeto a la API
    const response = await fetch(API_RESERVATIONS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaReserva)
    });

    if (!response.ok) {
      throw new Error("No se pudo crear la reserva en el servidor.");
    }

    // Leer respuesta del backend
    const reservaCreada = await response.json();
    alert("Reserva creada correctamente. ID: " + reservaCreada.id);

    return reservaCreada;

  } catch (error) {
    alert("Error al crear reserva: " + error.message);
  }
}

