const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
    try {
        // Hardcoded data for testing
        const hardcodedData = {
            fullName: "Test User",
            username: "testuser123",
            password: "password123",
            leetcodeProfile: "test_leetcode",
        };

        const { fullName, username, password, leetcodeProfile } = hardcodedData;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fullName, username, password: hashedPassword, leetcodeProfile });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ... rest of your routes (login, etc.) ...
module.exports = router;