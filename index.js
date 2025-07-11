import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import EventRouter from './src/controllers/event-controller.js';
dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

//2-Listado de Eventos
app.use('/api/event', EventRouter);

//3-Busqueda de un Evento

app.listen(port, () => {
    console.log(`"server" Listening on port ${port}`)
})