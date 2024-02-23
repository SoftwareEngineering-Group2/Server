const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { updateWhiteLed, updateYellowLed } = require('./databaseConnection');

// Middleware
app.use(express.json()); // for parsing application/json

// Route for turning white led on/off
app.post('/whiteLed', async (req, res) => {
    const { state } = req.body; // state is expected to be true or false
    
    try {
        await updateWhiteLed(state);
        // Send response back to client indicating the action taken
        res.json({ message: `Lamp turned ${state ? 'on' : 'off'}` });
    } catch (error) {
        // Handle errors by sending a 500 status code and the error message
        res.status(500).json({ error: error.message });
    }
});

app.post('/yellowLed', async (req, res) => {
    const { state } = req.body; // state is expected to be true or false
    
    try {
        await updateYellowLed(state);
        // Send response back to client indicating the action taken
        res.json({ message: `Lamp turned ${state ? 'on' : 'off'}` });
    } catch (error) {
        // Handle errors by sending a 500 status code and the error message
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
