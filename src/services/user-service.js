import UserRepository from '../repositories/user-repository.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export default class UserService {
  repo = new UserRepository();

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  validateName(name) {
    return typeof name === 'string' && name.trim().length >= 3;
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
    if (!this.validateEmail(username)) {
      throw { status: 400, message: "El email es invalido." };
    }
    if (!this.validatePassword(password)) {
      throw { status: 400, message: "El campo password debe tener al menos 3 caracteres." };
    }

    const existingUser = await this.repo.getUserByUsernameAsync(username);
    if (existingUser) {
      throw { status: 400, message: "El usuario ya existe." };
    }

    const passwordHashed = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await this.repo.createUserAsync({
      first_name,
      last_name,
      username,
      password: passwordHashed,
    });

    return user;
  }

  async loginAsync({ username, password }) {
    if (!this.validateEmail(username)) {
      throw { status: 400, message: "El email es invalido." };
    }
    const user = await this.repo.getUserByUsernameAsync(username);
    if (!user) {
      throw { status: 401, message: "Usuario o clave inválida." };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw { status: 401, message: "Usuario o clave inválida." };
    }

    return user;
  }
}
