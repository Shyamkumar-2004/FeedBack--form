
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    Name: String,
    Email: String,
    Rating: Number,
    Feedback: String
});

module.exports = mongoose.model('feedback', feedbackSchema);
