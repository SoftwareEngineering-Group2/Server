const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('./databaseConnection');


// Middleware
app.use(express.json()); // for parsing application/json

// Route for turning lamp on/off
app.post('/lamp', (req, res) => {
    const { state } = req.body; // state can be "on" or "off"
    
    // CHANGE STATE IN DATABASE

    // Send response back to client
    res.json({ message: `Lamp turned "${state}"` });
});

// Route for signing in
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await signInWithEmailAndPassword(email, password);
        res.status(200).json({ user });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});


// Password should be encrypted before being send from the user.
// Route for creating a new user
app.post('/addUser', async (req, res) => {
    const { email, password } = req.body;
    console.log(email, "   ", password)
    try {
        const user = await createUserWithEmailAndPassword(email, password);
        res.status(200).json({ user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});