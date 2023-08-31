import express from "express"; //express ist ein Framework um die API zu erstellen
import cors from 'cors'; // cors erlaubt es die Kommunikations-Regeln zwischen Frontend und Backend festzulegen
import mongoose from 'mongoose'; // ist die Datenbank MongoDB

import {userRouter} from './routes/users.js';
import { essenRouter } from "./routes/essen.js";
import {essensplanRouter} from "./routes/essensplan.js"

const app = express();

app.use(express.json()); // diese Zeile wandelt alle Daten die aus dem Frontend gesendet werden in Json um
app.use(cors());

app.use("/auth", userRouter);
app.use("/essen", essenRouter);
//TODO Hier muss vermutlich der essensplanRouter hinzugefügt werden
app.use("/essenplan", essensplanRouter);

mongoose.connect("mongodb+srv://webmo:webmo@cluster0.natgdma.mongodb.net/webmo?retryWrites=true&w=majority");

app.listen(3001, () => console.log("SERVER GESTARTET"));