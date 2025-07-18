import dbConfig from '../../database/db.js';
import pkg from 'pg';
const { Client } = pkg;

export default class EventLocationRepository {
  async findAllByUser(userId) {
    const client = new Client(dbConfig);
    const sql = `SELECT * FROM event_locations WHERE id_creator_user = $1`;
    await client.connect();

    try {
      const result = await client.query(sql, [userId]);
      await client.end();
      return result.rows;
    } catch (error) {
      await client.end();
      throw error;
    }
  }

  async findById(id) {
    const client = new Client(dbConfig);
    const sql = `SELECT * FROM event_locations WHERE id = $1`;
    await client.connect();

    try {
      const result = await client.query(sql, [id]);
      await client.end();
      return result.rows[0];
    } catch (error) {
      await client.end();
      throw error;
    }
  }
}
