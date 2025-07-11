// src/repositories/ProvinceRepository.js
import dbConfig from '../../database/db';
import pkg from 'pg';
const { Client } = pkg;

export default class ProvinceRepository {
    getAllAsync = async () => {
        let returnArray = null;
        const client = new Client(dbConfig); // Usa la config exportada

        try {
            await client.connect();
            const sql = 'SELECT * FROM provinces';
            const result = await client.query(sql);
            await client.end();
            returnArray = result.rows;
        } catch (error) {
            console.log('Error al obtener provincias:', error);
        }

        return returnArray;
    };

    getByIdAsync = async (id) => {
        // lo mismo, creando un nuevo Client con DBConfig
    };

    createAsync = async (province) => {
        // etc.
    };

    updateAsync = async (province) => {
        // etc.
    };

    deleteByIdAsync = async (id) => {
        // etc.
    };
}