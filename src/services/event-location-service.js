import EventLocationRepository from '../repositories/event-location-repository.js';

export default class EventLocationService {
  repo = new EventLocationRepository();

  async getAllByUser(userId) {
    return await this.repo.findAllByUser(userId);
  }

  async getByIdIfOwned(id, userId) {
    const location = await this.repo.findById(id);
    if (!location || location.id_creator_user !== userId) return null;
    return location;
  }
}
