import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import EventRouter from './src/controllers/event-controller.js';
import UserRouter from './src/controllers/user-controller.js';
import EventLocationRouter from './src/controllers/event-location-controller.js';
dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/event', EventRouter);

app.use('/api/user', UserRouter);

app.use('/api/event-location', EventLocationRouter);

app.listen(port, () => {
    console.log(`"server" Listening on port ${port}`)
})