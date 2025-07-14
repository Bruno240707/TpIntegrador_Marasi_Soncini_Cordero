import { Router } from 'express';
import UserService from '../services/user-service.js';
import jwt from 'jsonwebtoken';

const router = Router();
const svc = new UserService();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está definido en las variables de entorno.');
}

// POST /api/user/register
router.post('/register', async (req, res) => {
  const { first_name, last_name, username, password } = req.body;

  try {
    await svc.registerAsync({ first_name, last_name, username, password });
    return res.status(201).json({ success: true, message: "Usuario registrado correctamente." });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    const status = error.status || 500;
    const message = error.message || 'Error interno.';
    return res.status(status).json({ success: false, message, token: "" });
  }
});

// POST /api/user/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await svc.loginAsync({ username, password });

    const payload = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });

    return res.status(200).json({
      success: true,
      message: "",
      token
    });
  } catch (error) {
    console.error('Error al hacer login:', error);
    const status = error.status || 500;
    const message = error.message || 'Error interno.';
    return res.status(status).json({ success: false, message, token: "" });
  }
});

export default router;
