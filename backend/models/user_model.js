import mongoose from 'mongoose'

// create schema
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true

    },
    role: {
        type: String,
        enum: ["user", "counselor"], 
        required: true// value must be one of this options
    },
    password: {
        type: String,
        required: true
    },
}, {
    timestamps: true // stores created at, updated at information
});

// create the model
export const User = mongoose.model('User', userSchema);
