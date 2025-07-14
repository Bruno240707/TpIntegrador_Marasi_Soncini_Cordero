import dbConfig from '../../database/db.js';
import pkg from 'pg';
const { Client } = pkg;

export default class EventRepository {
  // Punto 1 y 2
  getByFiltersAsync = async ({ name }) => {
    const client = new Client(dbConfig);
    const values = [];
    const conditions = [];

    if (name) {
      values.push(`%${name}%`);
      conditions.push(`e.name ILIKE $${values.length}`);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
      SELECT
        e.id,
        e.name,
        e.description,
        e.start_date,
        e.duration_in_minutes,
        e.price,
        e.enabled_for_enrollment,
        e.max_assistance,

        json_build_object(
          'id', u.id,
          'first_name', u.first_name,
          'last_name', u.last_name,
          'username', u.username
        ) AS creator_user,

        json_build_object(
          'id', el.id,
          'name', el.name,
          'full_address', el.full_address,
          'latitude', el.latitude,
          'longitude', el.longitude,
          'province', json_build_object(
            'id', p.id,
            'name', p.name,
            'full_name', p.full_name,
            'latitude', p.latitude,
            'longitude', p.longitude
          )
        ) AS location

      FROM events              e
        JOIN users             u  ON u.id = e.id_creator_user
        JOIN event_locations   el ON el.id = e.id_event_location
        JOIN locations         l  ON l.id = el.id_location
        JOIN provinces         p  ON p.id = l.id_province
      ${where}
      ORDER BY e.start_date DESC;
    `;

    try {
      await client.connect();
      const result = await client.query(sql, values);
      return result.rows;
    } catch (error) {
      console.error('Error al filtrar eventos:', error);
      return [];
    } finally {
      await client.end();
    }
  };

  // Punto 3
  getByIdAsync = async (id) => {
    const client = new Client(dbConfig);

    const eventQuery = `
      SELECT
        e.*,

        json_build_object(
          'id', u.id,
          'first_name', u.first_name,
          'last_name', u.last_name,
          'username', u.username
        ) AS creator_user,

        json_build_object(
          'id', el.id,
          'name', el.name,
          'full_address', el.full_address,
          'max_capacity', el.max_capacity,
          'latitude', el.latitude,
          'longitude', el.longitude,
          'location', json_build_object(
            'id', l.id,
            'name', l.name,
            'province', json_build_object(
              'id', p.id,
              'name', p.name,
              'full_name', p.full_name,
              'latitude', p.latitude,
              'longitude', p.longitude
            )
          ),
          'creator_user', json_build_object(
            'id', u.id,
            'first_name', u.first_name,
            'last_name', u.last_name,
            'username', u.username
          )
        ) AS event_location
      FROM events e
        JOIN users u ON u.id = e.id_creator_user
        JOIN event_locations el ON el.id = e.id_event_location
        JOIN locations l ON l.id = el.id_location
        JOIN provinces p ON p.id = l.id_province
      WHERE e.id = $1
    `;

    const tagsQuery = `
      SELECT t.id, t.name
      FROM event_tags et
      JOIN tags t ON t.id = et.id_tag
      WHERE et.id_event = $1
    `;

    try {
      await client.connect();

      const eventResult = await client.query(eventQuery, [id]);
      if (eventResult.rows.length === 0) return null;

      const event = eventResult.rows[0];

      const tagsResult = await client.query(tagsQuery, [id]);
      event.tags = tagsResult.rows;

      return event;
    } catch (error) {
      console.error('Error al buscar evento por id:', error);
      return null;
    } finally {
      await client.end();
    }
  };

  // Obtener max_capacity de la ubicación del evento
  async getMaxCapacityByEventLocationId(id_event_location) {
    const client = new Client(dbConfig);
    const sql = `SELECT max_capacity FROM event_locations WHERE id = $1`;
    try {
      await client.connect();
      const res = await client.query(sql, [id_event_location]);
      if (res.rows.length === 0) return null;
      return res.rows[0].max_capacity;
    } finally {
      await client.end();
    }
  }

  // Insertar nuevo evento
  async insertEvent(eventData) {
    const client = new Client(dbConfig);
    const sql = `
      INSERT INTO events 
        (name, description, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user, id_event_location)
      VALUES 
        ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *
    `;
    const values = [
      eventData.name,
      eventData.description,
      eventData.start_date,
      eventData.duration_in_minutes,
      eventData.price,
      eventData.enabled_for_enrollment,
      eventData.max_assistance,
      eventData.id_creator_user,
      eventData.id_event_location
    ];

    try {
      await client.connect();
      const res = await client.query(sql, values);
      return res.rows[0];
    } finally {
      await client.end();
    }
  }

  // Actualizar evento existente
  async updateEvent(eventData) {
    const client = new Client(dbConfig);
    const sql = `
      UPDATE events SET
        name = $1,
        description = $2,
        start_date = $3,
        duration_in_minutes = $4,
        price = $5,
        enabled_for_enrollment = $6,
        max_assistance = $7,
        id_event_location = $8
      WHERE id = $9
      RETURNING *
    `;
    const values = [
      eventData.name,
      eventData.description,
      eventData.start_date,
      eventData.duration_in_minutes,
      eventData.price,
      eventData.enabled_for_enrollment,
      eventData.max_assistance,
      eventData.id_event_location,
      eventData.id
    ];

    try {
      await client.connect();
      const res = await client.query(sql, values);
      if (res.rows.length === 0) return null;
      return res.rows[0];
    } finally {
      await client.end();
    }
  }

  // Contar usuarios registrados a un evento (asumo tabla event_registrations)
  async countUsersRegisteredToEvent(id_event) {
    const client = new Client(dbConfig);
    const sql = `SELECT COUNT(*) AS total FROM event_registrations WHERE id_event = $1`;
    try {
      await client.connect();
      const res = await client.query(sql, [id_event]);
      return parseInt(res.rows[0].total, 10);
    } finally {
      await client.end();
    }
  }

  // Eliminar evento
  async deleteEvent(id) {
    const client = new Client(dbConfig);
    const sql = `DELETE FROM events WHERE id = $1 RETURNING *`;
    try {
      await client.connect();
      const res = await client.query(sql, [id]);
      if (res.rows.length === 0) return null;
      return res.rows[0];
    } finally {
      await client.end();
    }
  }
}
