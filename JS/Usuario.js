export const API_USERS = 'https://6913a83af34a2ff1170cc57b.mockapi.io/api/v1/users';

export class User {
  constructor(nombre, email, password, role = "USER") {
    this.nombre = nombre;
    this.email = email;
    this.password = password;
    this.role = role;     
  }
}

// Función para crear usuario
export async function crearUsuario(nombre, email, password, role) {
  let nuevoUsuario = new User(nombre, email, password, role);
  try {
    const response = await fetch(API_USERS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoUsuario)
    });

    if (!response.ok) {
      throw new Error("No se pudo crear el usuario en el servidor");
    }

    const user = await response.json();
    alert("Usuario creado correctamente: " + user.nombre);
    return user;
  } catch (error) {
    alert("Error al crear usuario: " + error.message);
  }
}

async function borrarTodosLosUsuarios() {
  try {
    const res = await fetch(API_USERS);
    const usuarios = await res.json();

    for (const usuario of usuarios) {
      await fetch(`${API_USERS}/${usuario.id}`, {
        method: 'DELETE'
      });
      console.log(`Usuario ${usuario.id} eliminado`);
    }

    console.log("Todos los usuarios fueron eliminados");
  } catch (error) {
    console.error("Error al borrar usuarios:", error);
  }
}
//borrarTodosLosUsuarios();
