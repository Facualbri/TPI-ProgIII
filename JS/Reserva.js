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


export async function crearReserva(nuevaReserva) {
  
    try {
        const response = await fetch(API_RESERVATIONS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevaReserva) // Enviamos el objeto de reserva como JSON
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`Error ${response.status}: No se pudo crear la reserva en el servidor. Detalle: ${errorDetails}`);
        }

        const reservaGuardada = await response.json();

        alert("Reserva creada correctamente. ID de Reserva: " + reservaGuardada.id);
        
        return { success: true, data: reservaGuardada }; 
        
    } catch (error) {
        alert("Error al crear reserva: " + error.message);
        return { success: false, message: error.message };
    }
}