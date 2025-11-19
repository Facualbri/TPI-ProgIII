export const API_ROOMS = 'https://6913a83af34a2ff1170cc57b.mockapi.io/api/v1/rooms';

export class Room {
  constructor(id, tipo, precio, disponible) {
    this.id = id;
    this.tipo = tipo;
    this.precio = precio;
    this.disponible = disponible;
  }
}

export async function crearHabitacion(id, tipo, precio, disponible) {

  const nuevaHabitacion = new Room(id, tipo, precio, disponible);

  const res = await fetch(API_ROOMS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: String(id),      // 💥 EL CAMBIO CLAVE: enviamos ID manual
      tipo,
      precio,
      disponible
    })
  });

  if (!res.ok) {
    throw new Error("Error creando habitación");
  }

  return await res.json();
}


export async function borrarTodasLasHabitaciones() {
  try {
    const res = await fetch(API_ROOMS);
    const habitaciones = await res.json();

    for (const hab of habitaciones) {
      await fetch(`${API_ROOMS}/${hab.id}`, {
        method: 'DELETE'
      });
      console.log(`Habitación ${hab.id} eliminada`);
    }

    console.log("✔ Todas las habitaciones fueron eliminadas");
  } catch (error) {
    console.error("Error al borrar habitaciones:", error);
  }
}
//borrarTodasLasHabitaciones();


const tipos = ["single", "double", "suite", "family", ];


export async function generarHabitacionesAuto() {
  try {

    for (let i = 1; i <= 27; i++) {

      const tipo = tipos[(i - 1) % tipos.length];
      const precio = 80 + (i * 10);

      await crearHabitacion(i, tipo, precio, true);

      console.log(`✔ Habitación creada → ID=${i}, Tipo=${tipo}, Precio=${precio}`);
    }

    console.log("✔ Las 27 habitaciones fueron generadas correctamente.");

  } catch (error) {
    console.error("❌ Error generando habitaciones:", error);
  }
}
//generarHabitacionesAuto();
