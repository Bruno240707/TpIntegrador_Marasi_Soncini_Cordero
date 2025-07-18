import dbConfig from '../../database/db.js';
import pkg from 'pg';
const { Client } = pkg;

export default class EventRepository {
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
      await client.end();
      return result.rows;
    } catch (error) {
      console.error('Error al filtrar eventos:', error);
      await client.end();
      return [];
    }
  };

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
      if (eventResult.rows.length === 0) {
        await client.end();
        return null;
      }

      const event = eventResult.rows[0];

      const tagsResult = await client.query(tagsQuery, [id]);
      event.tags = tagsResult.rows;

      await client.end();
      return event;
    } catch (error) {
      console.error('Error al buscar evento por id:', error);
      await client.end();
      return null;
    }
  };

  async getMaxCapacityByEventLocationId(id_event_location) {
    const client = new Client(dbConfig);
    const sql = `SELECT max_capacity FROM event_locations WHERE id = $1`;
    try {
      await client.connect();
      const res = await client.query(sql, [id_event_location]);
      await client.end();
      if (res.rows.length === 0) return null;
      return res.rows[0].max_capacity;
    } catch (error) {
      await client.end();
      throw error;
    }
  }

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
      await client.end();
      return res.rows[0];
    } catch (error) {
      await client.end();
      throw error;
    }
  }

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
      await client.end();
      if (res.rows.length === 0) return null;
      return res.rows[0];
    } catch (error) {
      await client.end();
      throw error;
    }
  }

  async countUsersRegisteredToEvent(id_event) {
    const client = new Client(dbConfig);
    const sql = `SELECT COUNT(*) AS total FROM event_enrollments WHERE id_event = $1`;
    try {
      await client.connect();
      const res = await client.query(sql, [id_event]);
      await client.end();
      return parseInt(res.rows[0].total, 10);
    } catch (error) {
      await client.end();
      throw error;
    }
  }

  async deleteEvent(id) {
    const client = new Client(dbConfig);
    const sql = `DELETE FROM events WHERE id = $1 RETURNING *`;
    try {
      await client.connect();
      const res = await client.query(sql, [id]);
      await client.end();
      if (res.rows.length === 0) return null;
      return res.rows[0];
    } catch (error) {
      await client.end();
      throw error;
    }
  }

  async enrollUserToEvent(userId, eventId) {
    const client = new Client(dbConfig);
    const sql = `
      INSERT INTO event_enrollments (id_user, id_event, registration_date_time)
      VALUES ($1, $2, NOW())
      RETURNING *
    `;
    try {
      await client.connect();
      const res = await client.query(sql, [userId, eventId]);
      await client.end();
      return res.rows[0];
    } catch (error) {
      await client.end();
      throw error;
    }
  }

  async unenrollUserFromEvent(userId, eventId) {
    const client = new Client(dbConfig);
    const sql = `
      DELETE FROM event_enrollments
      WHERE id_user = $1 AND id_event = $2
      RETURNING *
    `;
    try {
      await client.connect();
      const res = await client.query(sql, [userId, eventId]);
      await client.end();
      return res.rows[0];
    } catch (error) {
      await client.end();
      throw error;
    }
  }

  async isUserEnrolled(userId, eventId) {
    const client = new Client(dbConfig);
    const sql = `
      SELECT 1 FROM event_enrollments
      WHERE id_user = $1 AND id_event = $2
      LIMIT 1
    `;
    try {
      await client.connect();
      const res = await client.query(sql, [userId, eventId]);
      await client.end();
      return res.rowCount > 0;
    } catch (error) {
      await client.end();
      throw error;
    }
  }

  async getEnrollmentCount(eventId) {
    const client = new Client(dbConfig);
    const sql = `
      SELECT COUNT(*) AS count
      FROM event_enrollments
      WHERE id_event = $1
    `;
    try {
      await client.connect();
      const res = await client.query(sql, [eventId]);
      await client.end();
      return parseInt(res.rows[0].count);
    } catch (error) {
      await client.end();
      throw error;
    }
  }
}
