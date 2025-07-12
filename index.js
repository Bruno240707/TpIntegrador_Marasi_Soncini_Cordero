import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import EventRouter from './src/controllers/event-controller.js';
dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

//2 Y 3-Listado de Eventos
app.use('/api/event', EventRouter);

//4-Busqueda por id
app.use('/api/event/:id', EventRouter);

app.listen(port, () => {
    console.log(`"server" Listening on port ${port}`)
})