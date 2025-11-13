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
