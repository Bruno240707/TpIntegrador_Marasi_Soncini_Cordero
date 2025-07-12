import EventRepository from '../repositories/event-repository.js';

export default class EventService {
  repo = new EventRepository();

  // Punto 1 y 2
  getByFiltersAsync = async (filters) => {
    return await this.repo.getByFiltersAsync(filters);
  };

  // Punto 3
  getByIdAsync = async (id) => {
    return await this.repo.getByIdAsync(id);
  };
}
