import EventRepository from '../repositories/event-repository.js';

export default class EventService {
  repo = new EventRepository();

  getByFiltersAsync = async (filters) =>
    await this.repo.getByFiltersAsync(filters);
}
