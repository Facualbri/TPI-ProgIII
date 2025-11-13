export const API_ROOMS = 'https://6913a83af34a2ff1170cc57b.mockapi.io/api/v1/rooms';

export class Room {
  constructor(id, tipo, precio, disponible) {
    this.id = id;
    this.tipo = tipo;
    this.precio = precio;
    this.disponible = disponible;
  }

  marcarOcupada() {
    this.disponible = false;
  }

  marcarDisponible() {
    this.disponible = true;
  }
}
