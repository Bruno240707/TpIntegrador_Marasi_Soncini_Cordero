import { Router } from 'express';
import EventService from '../services/event-service.js';
import { authenticateToken as authMiddleware } from '../middlewares/auth-middleware.js'; // corregido import

const router = Router();
const svc = new EventService();

// GET /api/event?name=algo - Punto 1 y 2
router.get('', async (req, res) => {
  const filters = {
    name: req.query.name
  };

  try {
    const data = await svc.getByFiltersAsync(filters);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error al listar eventos:', error);
    return res.status(500).send('Error al listar eventos');
  }
});

// GET /api/event/:id - Punto 3
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send('ID inválido');
  }

  try {
    const event = await svc.getByIdAsync(id);
    if (!event) {
      return res.status(404).send('Evento no encontrado');
    }
    return res.status(200).json(event);
  } catch (error) {
    console.error('Error al obtener evento por id:', error);
    return res.status(500).send('Error al obtener evento');
  }
});

// POST /api/event/ - Crear evento (requiere autenticación)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // asumimos que authMiddleware pone user en req
    const eventData = req.body;

    const newEvent = await svc.createEventAsync(eventData, userId);

    return res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error al crear evento:', error);

    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Error interno al crear evento' });
  }
});

// PUT /api/event/ - Actualizar evento (requiere autenticación)
router.put('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const eventData = req.body;

    const updatedEvent = await svc.updateEventAsync(eventData, userId);

    return res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error al actualizar evento:', error);

    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Error interno al actualizar evento' });
  }
});

// DELETE /api/event/:id - Eliminar evento (requiere autenticación)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const deletedEvent = await svc.deleteEventAsync(id, userId);

    return res.status(200).json(deletedEvent);
  } catch (error) {
    console.error('Error al eliminar evento:', error);

    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Error interno al eliminar evento' });
  }
});

export default router;
