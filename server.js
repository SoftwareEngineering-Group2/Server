const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { updateWhiteLed, readWhiteLedState, updateYellowLed, readYellowLedState } = require('./databaseConnection');

// Middleware
app.use(express.json()); // for parsing application/json

app.post('/whiteLed', async (req, res) => {
    const { state } = req.body; 
    try {
        await updateWhiteLed(state);
        res.json({ message: `Lamp turned ${state}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/whiteLed', async (req, res) => {
    try {
      const state = await readWhiteLedState();
      res.json({ state: state, message: `White LED is currently ${state}` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

app.post('/yellowLed', async (req, res) => {
    const { state } = req.body;
    try {
        await updateYellowLed(state);
        res.json({ message: `Lamp turned ${state}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/yellowLed', async (req, res) => {
    try {
      const state = await readYellowLedState();
      res.json({ state: state });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
