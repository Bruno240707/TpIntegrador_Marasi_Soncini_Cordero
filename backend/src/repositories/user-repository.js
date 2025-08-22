import dbConfig from '../../database/db.js';
import pkg from 'pg';
const { Client } = pkg;

export default class UserRepository {
  async createUserAsync({ first_name, last_name, username, password }) {
    const client = new Client(dbConfig);
    const sql = `
      INSERT INTO users (first_name, last_name, username, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, first_name, last_name, username
    `;

    try {
      await client.connect();
      const res = await client.query(sql, [first_name, last_name, username, password]);
      await client.end();
      return res.rows[0];
    } catch (err) {
      console.error('Error creating user:', err);
      await client.end();
      throw err;
    }
  }

  async getUserByUsernameAsync(username) {
    const client = new Client(dbConfig);
    const sql = `SELECT * FROM users WHERE username = $1`;

    try {
      await client.connect();
      const res = await client.query(sql, [username]);
      await client.end();
      if (res.rows.length === 0) return null;
      return res.rows[0];
    } catch (err) {
      console.error('Error getting user by username:', err);
      await client.end();
      throw err;
    }
  }
}
