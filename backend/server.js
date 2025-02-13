// require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userModel=require('./models/user')
const app = express();
app.use(express.json());
// const port = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:5173", // Allow frontend origin
    methods: ["GET", "POST","UPDATE","DELETE","PUT"],        // Allow necessary HTTP methods
    credentials: true                 // If sending cookies
}));
mongoose.connect("mongodb+srv://kamireddycherri:Wr8RsGYhMRZLVAsp@cluster0.owrn7.mongodb.net/leetcode2?retryWrites=true&w=majority&appName=Cluster0")
//Wr8RsGYhMRZLVAsp


app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Find the user by username
    userModel.findOne({ username: username })
        .then(user => {
            if (user) {
                // Compare passwords (no hashing for now)
                if (user.password === password) {
                    res.json("success");
                } else {
                    res.json("Password is incorrect");
                }
            } else {
                res.json("User doesn't exist");
            }
        })
        .catch(err => res.json("Error: " + err));
});

// POST /signup: Register a new user
app.post('/signup', (req, res) => {
    const { fullName, username, password, leetcodeProfile } = req.body;

    // Create a new user
    userModel.create({
        fullName,
        username,
        password,  // No hashing for now
        leetcodeProfile
    })
        .then(user => res.json(user))
        .catch(err => res.json("Error: " + err));
});
app.get('/getuserprofile', (req, res) => {
    const { username } = req.query;

    userModel.findOne({ username })
        .then(user => {
            if (user) {
                res.json({
                    fullName: user.fullName,
                    username: user.username,
                    leetcodeProfile: `https://leetcode.com/u/${user.leetcodeProfile}`,
                    followers: user.followers || 0,
                    following: user.following || 0,
                });
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        })
        .catch(err => res.json("Error: " + err));
});
//--------------------
app.post('/follow', async (req, res) => {
    const { loggedInUser, targetUser } = req.body;

    if (!loggedInUser || !targetUser) {
        return res.status(400).json({ error: "Invalid request" });
    }

    try {
        // Find both users by username
        const user = await userModel.findOne({ username: loggedInUser });
        const target = await userModel.findOne({ username: targetUser });

        if (!user || !target) {
            return res.status(404).json({ error: "User not found" });
        }

        const userId = user._id;
        const targetId = target._id;

        // Prevent duplicate follows
        if (!user.following.includes(targetId)) {
            user.following.push(targetId);
            target.followers.push(userId);
        }

        await user.save();
        await target.save();

        res.json({ success: true, updatedFollowing: user.following });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

app.post('/unfollow', async (req, res) => {
    const { loggedInUser, targetUser } = req.body;

    if (!loggedInUser || !targetUser) {
        return res.status(400).json({ error: "Invalid request" });
    }

    try {
        const user = await userModel.findOne({ username: loggedInUser });
        const target = await userModel.findOne({ username: targetUser });

        if (!user || !target) {
            return res.status(404).json({ error: "User not found" });
        }

        const userId = user._id;
        const targetId = target._id;

        // Remove ObjectId from arrays
        user.following = user.following.filter(id => !id.equals(targetId));
        target.followers = target.followers.filter(id => !id.equals(userId));

        await user.save();
        await target.save();

        res.json({ success: true, updatedFollowing: user.following });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});


app.listen(3001,()=>{
    console.log("server is running");
})