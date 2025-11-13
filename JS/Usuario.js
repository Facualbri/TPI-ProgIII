export const API_USERS = 'https://6913a83af34a2ff1170cc57b.mockapi.io/api/v1/users';

export class User {
  constructor(id, nombre, email, password, role) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  esAdmin() {
    return this.role === "ADMIN";
  }
}

export async function crearUsuario(nombre, email, password, role) {
  const nuevoUsuario = { nombre, email, password, role };

  try {
    const response = await fetch(API_USERS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoUsuario)
    });
    const user = await response.json();
    console.log('Usuario creado:', user);
    return user;
  } catch (error) {
    console.error('Error al crear usuario:', error);
  }
}
export async function registrarUsuario(nombre, email, password, role = "cliente") {
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
