const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(express.json()); // for parsing application/json

// Route for turning lamp on/off
app.post('/lamp', (req, res) => {
    const { state } = req.body; // state can be "on" or "off"
    
    // CHANGE STATE IN DATABASE

    // Send response back to client
    res.json({ message: `Lamp turned "${state}"` });
});


// Password should be encrypted before being send from the user.
app.post('/addUser', (req, res) => {
    const { email, password } = req.body;
    
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});