const express = require('express');
const { updateDeviceState, readDeviceState, readDeviceImage, getAllDevices } = require('./databaseConnection');
const { authenticate } = require('./authMiddleware'); // Import the middleware
const app = express();
const PORT = process.env.PORT || 3000;

const cors = require('cors');

// Import Swagger packages
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

// Load Swagger documentation
const swaggerDocument = YAML.load('./swagger.yaml');

//app.use(express.json());

// Use CORS and allow all origins
app.use(cors({
  origin: '*' // Allows requests from any origin
}));

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

app.get('/devices/state', async (req, res) => {
  try {
    const allDevices = await getAllDevices();
    res.json({ allDevices });
  } catch (error) {
    console.error(`Error fetching devices:`, error);
    res.status(500).json({ error: 'Failed to fetch devices' });
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
  } catch (error) {    res.status(500).json({ error: error.message });
  }
});


// ROUTE FOR TESTING CLIENT AUTHORIZATION
app.get('/test/devices/state', authenticate, async (req, res) => {
  try {
    const allDevices = await getAllDevices();
    res.json({ allDevices });
  } catch (error) {
    console.error(`Error fetching devices:`, error);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});



// Serve Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
