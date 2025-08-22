import UserRepository from '../repositories/user-repository.js';

export default class UserService {
  repo = new UserRepository();

  validateName(name) {
    return typeof name === 'string' && name.trim().length >= 3;
  }

  validateUsername(username) {
    return typeof username === 'string' && username.trim().length >= 3;
  }

  validatePassword(password) {
    return typeof password === 'string' && password.length >= 3;
  }

  async registerAsync({ first_name, last_name, username, password }) {
    if (!this.validateName(first_name)) {
      throw { status: 400, message: "El campo first_name debe tener al menos 3 caracteres." };
    }
    if (!this.validateName(last_name)) {
      throw { status: 400, message: "El campo last_name debe tener al menos 3 caracteres." };
    }
    if (!this.validateUsername(username)) {
      throw { status: 400, message: "El campo username debe tener al menos 3 caracteres." };
    }
    if (!this.validatePassword(password)) {
      throw { status: 400, message: "El campo password debe tener al menos 3 caracteres." };
    }

    const existingUser = await this.repo.getUserByUsernameAsync(username);
    if (existingUser) {
      throw { status: 400, message: "El usuario ya existe." };
    }

    const user = await this.repo.createUserAsync({
      first_name,
      last_name,
      username,
      password
    });

    return user;
  }

  async loginAsync({ username, password }) {
    if (!this.validateUsername(username)) {
      throw { status: 400, message: "El campo username es inválido." };
    }

    const user = await this.repo.getUserByUsernameAsync(username);
    if (!user || user.password !== password) {
      throw { status: 401, message: "Usuario o clave inválida." };
    }

    return user;
  }
}
