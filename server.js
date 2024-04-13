const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const feedback = require('./models/feedback'); 



const app = express();
const port = 7006;

mongoose.connect("mongodb://127.0.0.1:27017/feedbackDB");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Render the form index page
app.get('/', (req, res) => {
    res.render('form-index');
});

// Save feedback from the form
app.post('/save-feedback', async (req, res) => {
    const { Name, Email, Rating, Feedback } = req.body;
    const data = new feedback({ Name, Email, Rating, Feedback }); // Use Feedback model
    await data.save();
    console.log('Feedback successfully posted...');
    res.redirect('/');
});

// View feedback
app.get('/view-feedback', async (req, res) => {
    const feedbacks = await feedback.find();
    res.render('view-feedback', { feedbacks });
});


app.get('/edit-feedback/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const findfeedback = await feedback.findById(id);
        if (!findfeedback) {
            return res.status(404).send('Feedback not found');
        }
        res.render('edit-feedback', { findfeedback }); // Pass findfeedback instead of feedback
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/update-feedback/:id', async (req, res) => {
    const { id } = req.params;
    const { Name, Email, Rating, Feedback } = req.body;
    try {
        const updatedFeedback = await feedback.findByIdAndUpdate(id, { Name, Email, Rating, Feedback });
        if (!updatedFeedback) {
            return res.status(404).send('Feedback not found');
        }
        console.log('Feedback successfully updated...');
        res.redirect('/view-feedback'); // Redirect to the feedback list page after updating
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Delete feedback
app.post('/delete-feedback/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedFeedback = await feedback.findByIdAndDelete(id);
        if (!deletedFeedback) {
            return res.status(404).send('Feedback not found');
        }
        console.log('Feedback successfully deleted...');
        res.redirect('/view-feedback'); // Redirect to the feedback list page after deleting
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});











app.listen(port, () => {
    console.log("Server started on port " + port);
});
