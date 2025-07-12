const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        minlength: [5, "Username must be at least 5 characters long"]
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        minlength: [10, "Email must be at least 10 characters long"]
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [6, "Password must be at least 6 characters long"]
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
