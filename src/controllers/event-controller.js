import { Router } from 'express';
import EventService from '../services/event-service.js';

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

export default router;
