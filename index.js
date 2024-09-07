const express = require('express');
const bodyparser=  require('body-parser');
const tradeRouters = require("./routes/tradeRouters");
const cargoRouters = require("./routes/cargoRouters");
const inventoryRouters = require("./routes/inventoryRouters");
const connectDB = require('./config/db');
const errorhandler = require('./utilis/errorHandler');
const WebSocket = require('ws');
require('dotenv').config();
const app = express();
const port = process.env.PORT;
const eventEmitter = require("./utilis/eventprocessing");

connectDB();
app.use(express.json());
app.use(bodyparser.json());

app.use('/api',tradeRouters);
app.use('/api',cargoRouters);
app.use('/api', inventoryRouters);

app.use(errorhandler);
const wss = new WebSocket.Server({ noServer: true });

// Handle WebSocket connections for real-time updates
wss.on('connection', (ws) => {
    console.log('Client connected to real-time updates');

    // Send real-time trade updates to the client
    eventEmitter.on('tradeUpdated', (trade) => {
        ws.send(JSON.stringify({
            event: 'tradeUpdated',
            data: trade
        }));
    });

    // Send real-time cargo updates to the client
    eventEmitter.on('cargoUpdated', (cargo) => {
        ws.send(JSON.stringify({
            event: 'cargoUpdated',
            data: cargo
        }));
    });

    // Handle critical event notifications
    eventEmitter.on('criticalEvent', (event) => {
        ws.send(JSON.stringify({
            event: 'criticalEvent',
            message: event.message
        }));
    });

    ws.on('close', () => {
        console.log('Client disconnected from real-time updates');
    });
});

// Create HTTP server and upgrade to WebSocket for /api/updates/real-time
const server = app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
});

server.on('upgrade', (request, socket, head) => {
    if (request.url === '/api/updates/real-time') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});




