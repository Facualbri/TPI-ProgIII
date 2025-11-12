const API_USERS = 'https://6913a83af34a2ff1170cc57b.mockapi.io/api/v1/users';

async function crearUsuario(nombre, email, password, role) {
  const nuevoUsuario = { nombre, email, password, role };

  try {
    const response = await fetch(API_USERS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoUsuario)
    });
    const users = await response.json();
    console.log('Usuario creado:', users);
  } catch (error) {
    console.error('Error al crear usuario:', error);
  }
}
const btnRegistrar = document.getElementsByClassName("btn btn-success");
btnRegistrar.addEventListener("click", crearUsuario);

class User {
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