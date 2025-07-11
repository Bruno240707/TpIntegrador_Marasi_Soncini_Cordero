import { Router } from 'express';
import EventService from '../services/event-service.js';

const router = Router();
const svc = new EventService();

// GET /api/event?name=algo
router.get('', async (req, res) => {
  const filters = {
    name: req.query.name,
    id: req.query.id
  };

  const data = await svc.getByFiltersAsync(filters);

  if (filters.id && data.length === 0) {
    return res.status(500).send('Error: id no encontrado');
  }

  if (data) {
    return res.status(200).json(data);
  }

  return res.status(500).send('Error al buscar eventos');
});


export default router;
