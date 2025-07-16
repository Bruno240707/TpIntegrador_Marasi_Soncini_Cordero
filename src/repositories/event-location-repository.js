import dbConfig from '../../database/db.js';
import pkg from 'pg';
const { Client } = pkg;

export default class EventLocationRepository {
  async findAllByUser(userId) {
    const client = new Client(dbConfig);
    const sql = `SELECT * FROM event_locations WHERE id_creator_user = $1`;
    try {
      await client.connect();
      const result = await client.query(sql, [userId]);
      return result.rows;
    } finally {
      await client.end();
    }
  }

  async findById(id) {
    const client = new Client(dbConfig);
    const sql = `SELECT * FROM event_locations WHERE id = $1`;
    try {
      await client.connect();
      const result = await client.query(sql, [id]);
      return result.rows[0];
    } finally {
      await client.end();
    }
  }
}