const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const { updateDeviceState, readDeviceState, readDeviceImage, getAllDevices } = require('./databaseConnection');
const { authenticate } = require('./authMiddleware'); // Import the middleware
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allows WebSocket connections from any origin
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;
const swaggerDocument = YAML.load('./swagger.yaml');

// Middleware
app.use(cors({ origin: '*' }));
//app.use(express.json()); // Uncomment if you're parsing JSON bodies

// Serve Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Modify API routes to emit events
app.post('/device/:type', async (req, res) => {
  const { type } = req.params;
  const { state } = req.body;
  try {
    await updateDeviceState(type, state);
    res.json({ message: `${type} turned ${state}` });
    io.emit('device-state-changed', { type, state }); // Emitting to all clients
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

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
