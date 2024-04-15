const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const { updateDeviceState, readDeviceState, readDeviceImage, getAllDevices, updateSpecificInformation, updateUserNames, getUserNamesByUid, getAllDevicesTest } = require('./databaseConnection');
const { authenticate } = require('./authMiddleware');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;
const swaggerDocument = YAML.load('./swagger.yaml');

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Serve Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// WebSocket connection
io.on('connection', async (socket) => {
  console.log('A user connected');
  try {
    const allDevices = await getAllDevices();
    io.emit('all-devices', allDevices)
  } catch (error) {
    console.error(`Error fetching devices:`, error);
  }
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Route for updating the state of a device
app.post('/device/:type',/*authenticate,*/ async (req, res) => {
  const { type } = req.params;
  const { state } = req.body;
  try {
    await updateDeviceState(type, state);
    res.json({ message: `${type} turned ${state}` });
    const allDevices = await getAllDevices();
    io.emit('device-state-changed', allDevices); // Emitting to all clients
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for adding/updating a users firstname and lastname
app.post('/user/:uid',/*authenticate,*/ async(req,res) => {
  const { uid } = req.params;
  const { firstName, lastName} = req.body;
  try{
    await updateUserNames(uid, firstName, lastName)
    res.json(`First name: ${firstName} last name: ${lastName} added to user with UID: ${uid}`)
  }
  catch(error){
    console.log(error)
  }
  
})

// Route for getting the user name from UID
app.get('/user/:uid', /*authenticate,*/ async(req, res) => {
  const { uid } = req.params;
  try {
    const name = await getUserNamesByUid(uid);
    res.json(name);
  } catch (error) { // <-- error needs to be caught here
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


// Route for getting all the devices and their state
app.get('/devices/state', /*authenticate,*/ async (req, res) => {
  try {
    const allDevices = await getAllDevices();
    res.json({ allDevices });
  } catch (error) {
    console.error(`Error fetching devices:`, error);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

app.get('/devices/testState/:uid', async(req, res) => {
  console.log("here")
  const { uid } = req.params;
  try{
    const allDevices = await getAllDevicesTest(uid);
    res.json({allDevices})
  }
  catch(error){
    console.error(`Error fetching devices:`, error)
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
})

// Route for reading a specific devices state
app.get('/device/:type/state',/*authenticate,*/ async (req, res) => {
  const { type } = req.params;
  try {
    const state = await readDeviceState(type);
    res.json({ state: state, message: `${type} is currently ${state}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for reading a specific devices image
app.get('/device/:type/image', /*authenticate,*/ async (req, res) => {
  const { type } = req.params;
  try {
    const imageUrl = await readDeviceImage(type);
    res.json({ imageUrl: imageUrl });
  } catch (error) {    res.status(500).json({ error: error.message });
  }
});

// Route for reading a specific information from a specific device
app.post('/device/:deviceName/:deviceInformation',/*authenticate,*/ async (req, res) => {
  const { deviceName, deviceInformation } = req.params;
  const { newInformation } = req.body;
  try {
    console.log(deviceName, deviceInformation)
    await updateSpecificInformation(deviceName, deviceInformation, newInformation);
    res.json({ message: `${deviceName} turned ${deviceInformation} to ${newInformation}` });
  }  catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;