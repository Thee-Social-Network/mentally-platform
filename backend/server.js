
import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js'


//API entry point

dotenv.config();

const app = express();

app.use(express.json()); // allow json data on request body

const PORT = 5000;

app.get("/", (req,res) =>{
    res.send("Server is ready");
});
app.listen(PORT, () =>{
    connectDB();
    console.log(`Server started on http://localhost/${PORT}`);
});