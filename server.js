const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { updateDeviceState, readDeviceState, readDeviceImage } = require('./databaseConnection');

app.use(express.json());

// Update device state
app.post('/device/:type', async (req, res) => {
  const { type } = req.params;
  const { state } = req.body;
  try {
    await updateDeviceState(type, state);
    res.json({ message: `${type} turned ${state}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read device state
app.get('/device/:type/state', async (req, res) => {
  const { type } = req.params;
  try {
    const state = await readDeviceState(type);
    res.json({ state: state, message: `${type} is currently ${state}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read device image URL
app.get('/device/:type/image', async (req, res) => {
  const { type } = req.params;
  try {
    const imageUrl = await readDeviceImage(type);
    res.json({ imageUrl: imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
