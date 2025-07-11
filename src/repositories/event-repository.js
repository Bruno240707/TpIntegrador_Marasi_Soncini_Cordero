import dbConfig from '../../database/db.js';
import pkg from 'pg';
const { Client } = pkg;

export default class EventRepository {
  getByFiltersAsync = async ({ name, id }) => {
    const client = new Client(dbConfig);
    const values = [];
    const conditions = [];

    if (name) {
      values.push(`%${name}%`);
      conditions.push(`e.name ILIKE $${values.length}`);
    }

    if (id) {
        values.push(`${id}`);
        conditions.push(`e.id = $${values.length}`);
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
}
