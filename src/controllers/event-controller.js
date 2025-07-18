import { Router } from 'express';
import EventService from '../services/event-service.js';
import { authenticateToken as authMiddleware } from '../middlewares/auth-middleware.js';

const router = Router();
const svc = new EventService();

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

router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
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

router.post('/:id/enrollment', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  const userId = req.user.id;

  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  try {
    await svc.enrollUser(id, userId);
    return res.status(201).json({ message: 'Inscripción exitosa' });
  } catch (error) {
    console.error('Error al inscribirse:', error);
    return res.status(error.status || 500).json({ message: error.message || 'Error interno' });
  }
});

router.delete('/:id/enrollment', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  const userId = req.user.id;

  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  try {
    await svc.unenrollUser(id, userId);
    return res.status(200).json({ message: 'Inscripción cancelada correctamente' });
  } catch (error) {
    console.error('Error al cancelar inscripción:', error);
    return res.status(error.status || 500).json({ message: error.message || 'Error interno' });
  }
});

router.post('/:id/enrollment', authMiddleware, async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const userId = req.user.id;

    if (isNaN(eventId)) return res.status(400).json({ message: 'ID inválido' });

    const result = await svc.enrollUser(eventId, userId);
    return res.status(201).json({ message: 'Inscripción exitosa', result });
  } catch (error) {
    console.error('Error al inscribirse:', error);
    return res.status(error.status || 500).json({ message: error.message || 'Error interno' });
  }
});

router.delete('/:id/enrollment', authMiddleware, async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const userId = req.user.id;

    if (isNaN(eventId)) return res.status(400).json({ message: 'ID inválido' });

    const result = await svc.unenrollUser(eventId, userId);
    return res.status(200).json({ message: 'Inscripción cancelada', result });
  } catch (error) {
    console.error('Error al cancelar inscripción:', error);
    return res.status(error.status || 500).json({ message: error.message || 'Error interno' });
  }
});


export default router;
