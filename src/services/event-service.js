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

  // Crear evento
  async createEventAsync(eventData, userId) {
    // Validaciones de negocio
    if (!eventData.name || eventData.name.trim().length < 3) {
      throw { status: 400, message: "El campo name debe tener al menos 3 caracteres." };
    }
    if (!eventData.description || eventData.description.trim().length < 3) {
      throw { status: 400, message: "El campo description debe tener al menos 3 caracteres." };
    }
    if (eventData.price < 0) {
      throw { status: 400, message: "El campo price no puede ser negativo." };
    }
    if (eventData.duration_in_minutes < 0) {
      throw { status: 400, message: "El campo duration_in_minutes no puede ser negativo." };
    }
    if (!eventData.max_assistance || eventData.max_assistance < 0) {
      throw { status: 400, message: "El campo max_assistance debe ser positivo." };
    }
    if (!eventData.id_event_location) {
      throw { status: 400, message: "Debe indicar id_event_location." };
    }

    // Validar max_capacity
    const maxCapacity = await this.repo.getMaxCapacityByEventLocationId(eventData.id_event_location);
    if (maxCapacity === null) {
      throw { status: 400, message: "id_event_location no válido." };
    }
    if (eventData.max_assistance > maxCapacity) {
      throw { status: 400, message: "El max_assistance no puede ser mayor que el max_capacity de la ubicación." };
    }

    eventData.id_creator_user = userId;

    const event = await this.repo.insertEvent(eventData);
    return event;
  }

  // Actualizar evento
  async updateEventAsync(eventData, userId) {
    if (!eventData.id) {
      throw { status: 400, message: "Debe indicar el id del evento para actualizar." };
    }
    if (!eventData.name || eventData.name.trim().length < 3) {
      throw { status: 400, message: "El campo name debe tener al menos 3 caracteres." };
    }
    if (!eventData.description || eventData.description.trim().length < 3) {
      throw { status: 400, message: "El campo description debe tener al menos 3 caracteres." };
    }
    if (eventData.price < 0) {
      throw { status: 400, message: "El campo price no puede ser negativo." };
    }
    if (eventData.duration_in_minutes < 0) {
      throw { status: 400, message: "El campo duration_in_minutes no puede ser negativo." };
    }
    if (!eventData.max_assistance || eventData.max_assistance < 0) {
      throw { status: 400, message: "El campo max_assistance debe ser positivo." };
    }
    if (!eventData.id_event_location) {
      throw { status: 400, message: "Debe indicar id_event_location." };
    }

    // Verificar evento existente y propiedad
    const existingEvent = await this.repo.getByIdAsync(eventData.id);
    if (!existingEvent) {
      throw { status: 404, message: "Evento no encontrado." };
    }
    if (existingEvent.id_creator_user !== userId) {
      throw { status: 404, message: "No tiene permiso para modificar este evento." };
    }

    // Validar max_capacity
    const maxCapacity = await this.repo.getMaxCapacityByEventLocationId(eventData.id_event_location);
    if (maxCapacity === null) {
      throw { status: 400, message: "id_event_location no válido." };
    }
    if (eventData.max_assistance > maxCapacity) {
      throw { status: 400, message: "El max_assistance no puede ser mayor que el max_capacity de la ubicación." };
    }

    // Actualizar evento
    const updatedEvent = await this.repo.updateEvent(eventData);
    return updatedEvent;
  }

  // Eliminar evento
  async deleteEventAsync(eventId, userId) {
    // Verificar evento existente y propiedad
    const existingEvent = await this.repo.getByIdAsync(eventId);
    if (!existingEvent) {
      throw { status: 404, message: "Evento no encontrado." };
    }
    if (existingEvent.id_creator_user !== userId) {
      throw { status: 404, message: "No tiene permiso para eliminar este evento." };
    }
  
    // Eliminar evento
    const deletedEvent = await this.repo.deleteEvent(eventId);
    return deletedEvent;
  }
}
