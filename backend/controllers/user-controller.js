import { User } from '../models/user_model.js';
import bcrypt from 'bcrypt';

export const createUser = async (req, res) => {
    try {
        const user = req.body;
        
        if(!user.first_name || !user.last_name || !user.email || !user.password || !user.role){
            return res.status(400).json({success: false, message: "Please provide all fields"});
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) {
            return res.status(400).json({success: false, message: "User with this email already exists"});
        }

        // Create user if no issues
        const newUser = new User(user);
        await newUser.save();
        
        res.status(201).json({success: true, data: {id: newUser._id, email: newUser.email, role: newUser.role}});
    } catch (error) {
        console.error("Error creating user: ", error.message);
        
        if (error.code === 11000) { // MongoDB duplicate key error
            return res.status(400).json({success: false, message: "User with this email already exists"});
        }
        
        res.status(500).json({success: false, message: "Server Error"});
    }
};

export const logUser = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        // Compare hashed passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        // Login successful - return user data
        res.json({ 
            success: true, 
            message: "Login successful", 
            user: { 
                id: user._id, 
                email: user.email, 
                role: user.role,
                first_name: user.first_name,
                last_name: user.last_name
            } 
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

