
import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js'
import {User} from './models/user_model.js';
import path from 'path';
import { fileURLToPath } from 'url';


//API entry point

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

app.use(express.json()); // allow json data on request body

const PORT = process.env.PORT || 5000;

app.post("/api/signup", async (req, res) =>{
    const user = req.body; //sent data
    if(!user.first_name || !user.last_name || !user.email || !user.password || !user.role){
        return res.status(400).json({sucesss: false, message: "Please provide all fields"});
    }

    //create user if no issues
    const newUser = new User(user);

    try {
        // saving user on db
        await newUser.save();
        res.status(201).json({success: true, data: newUser});
    } catch (error) {
        console.error("Error creating user: ", error.message)
        res.status(500).json({success: false, message: "Server Error"})
    }
});

// Route to serve landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/landing.html'));
});

app.listen(PORT, () =>{
    connectDB();
    console.log(`Server started on http://localhost:${PORT}`);
});