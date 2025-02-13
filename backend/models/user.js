const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true }, // Added full name
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    leetcodeProfile: { type: String },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users this person follows
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]  // Users following this person
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
