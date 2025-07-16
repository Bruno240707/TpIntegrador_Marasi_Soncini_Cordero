import { Router } from 'express';
import { authenticateToken as authMiddleware } from '../middlewares/auth-middleware.js';
import EventLocationService from '../services/event-location-service.js';

const router = Router();
const svc = new EventLocationService();

// GET /api/event-location → todas las ubicaciones del usuario autenticado
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    const locations = await svc.getAllByUser(userId);
    return res.status(200).json(locations);
  } catch (error) {
    console.error('Error al obtener event-locations:', error);
    return res.status(500).json({ message: 'Error interno' });
  }
});

// GET /api/event-location/:id → una ubicación específica si es del usuario
router.get('/:id', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const id = parseInt(req.params.id);

  if (isNaN(id)) return res.status(400).json({ message: 'ID inválido' });

  try {
    const location = await svc.getByIdIfOwned(id, userId);
    if (!location) return res.status(404).json({ message: 'No encontrado' });
    return res.status(200).json(location);
  } catch (error) {
    console.error('Error al obtener event-location por ID:', error);
    return res.status(500).json({ message: 'Error interno' });
  }
});

export default router;
