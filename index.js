import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ProvinceRouter from "./src/controllers/ejemplo-controller";
dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// EJEMPLO
app.use('/api/provinces', ProvinceRouter)
//

app.listen(port, () => {
    console.log(`"server" Listening on port ${port}`)
})