const request = require('supertest');
const http = require('http');
const app = require('../server.js'); 
const { updateDeviceState} = require('../databaseConnection.js'); 

describe('API Endpoint Tests', () => {
  let server;

  beforeAll((done) => {
    server = http.createServer(app);
    server.listen(4000, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should retrieve all devices', async () => {
    const response = await request(app).get('/devices/state');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.allDevices)).toBe(true);
  });

  it('should update and read back the state of a specific device', async () => {
    const deviceType = 'whiteLed';
    const newState = false;

    await updateDeviceState(deviceType, newState);

    const response = await request(app).get(`/device/${deviceType}/state`);
    expect(response.status).toBe(200);
    expect(response.body.state).toBe(newState);
  });

  it('should fetch the image URL for a specific device', async () => {
    const deviceType = 'whiteLed';

    const response = await request(app).get(`/device/${deviceType}/image`);
    expect(response.status).toBe(200);
    expect(response.body.imageUrl).toBeDefined();
  });
});