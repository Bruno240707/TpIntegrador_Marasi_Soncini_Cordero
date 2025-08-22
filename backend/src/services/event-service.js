import EventRepository from '../repositories/event-repository.js';

export default class EventService {
  repo = new EventRepository();

  getByFiltersAsync = async (filters) => {
    return await this.repo.getByFiltersAsync(filters);
  };

  getByIdAsync = async (id) => {
    return await this.repo.getByIdAsync(id);
  };

  async createEventAsync(eventData, userId) {
  
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

    const existingEvent = await this.repo.getByIdAsync(eventData.id);
    if (!existingEvent) {
      throw { status: 404, message: "Evento no encontrado." };
    }
    if (existingEvent.id_creator_user !== userId) {
      throw { status: 404, message: "No tiene permiso para modificar este evento." };
    }

    const maxCapacity = await this.repo.getMaxCapacityByEventLocationId(eventData.id_event_location);
    if (maxCapacity === null) {
      throw { status: 400, message: "id_event_location no válido." };
    }
    if (eventData.max_assistance > maxCapacity) {
      throw { status: 400, message: "El max_assistance no puede ser mayor que el max_capacity de la ubicación." };
    }

    const updatedEvent = await this.repo.updateEvent(eventData);
    return updatedEvent;
  }

  async deleteEventAsync(eventId, userId) {

    const existingEvent = await this.repo.getByIdAsync(eventId);
    if (!existingEvent) {
      throw { status: 404, message: "Evento no encontrado." };
    }
    if (existingEvent.id_creator_user !== userId) {
      throw { status: 404, message: "No tiene permiso para eliminar este evento." };
    }
  
    const deletedEvent = await this.repo.deleteEvent(eventId);
    return deletedEvent;
  }

async enrollUser(eventId, userId) {
  const event = await this.repo.getByIdAsync(eventId);
  if (!event) throw { status: 404, message: 'Evento no encontrado' };

  const now = new Date();
  const startDate = new Date(event.start_date);
  if (startDate <= now) throw { status: 400, message: 'El evento ya sucedió o es hoy' };

  if (!event.enabled_for_enrollment) {
    throw { status: 400, message: 'El evento no está habilitado para inscripción' };
  }

  const alreadyEnrolled = await this.repo.isUserEnrolled(userId, eventId);
  if (alreadyEnrolled) {
    throw { status: 400, message: 'Ya estás inscripto en este evento' };
  }

  const currentCount = await this.repo.getEnrollmentCount(eventId);
  if (currentCount >= event.max_assistance) {
    throw { status: 400, message: 'Se alcanzó el máximo de inscriptos' };
  }

  return await this.repo.enrollUserToEvent(userId, eventId);
}

async unenrollUser(eventId, userId) {
  const event = await this.repo.getByIdAsync(eventId);
  if (!event) throw { status: 404, message: 'Evento no encontrado' };

  const now = new Date();
  const startDate = new Date(event.start_date);
  if (startDate <= now) throw { status: 400, message: 'El evento ya sucedió o es hoy' };

  const alreadyEnrolled = await this.repo.isUserEnrolled(userId, eventId);
  if (!alreadyEnrolled) {
    throw { status: 400, message: 'No estás inscripto en este evento' };
  }

  return await this.repo.unenrollUserFromEvent(userId, eventId);
}

  
}
