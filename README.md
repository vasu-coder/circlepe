A Backend System for An intregalactic Trade Network.
## For DFD(Data FLow Diagram) Visit here -> https://app.eraser.io/workspace/K6gQfUG9SFqmXzaumnPl?origin=share
## 1. Project Overview
This project is a real-time system designed to handle trade and cargo management. It uses an event-driven architecture to trigger updates to cargo and inventory in response to changes in trade, and WebSocket integration provides real-time updates to connected clients.

## The project features:

A RESTful API for managing trades and cargo shipments.
Real-time updates via WebSocket for trades, cargo, and critical event notifications.
MongoDB as the backend database for storing trade, cargo, and inventory data.
Event-driven logic using EventEmitter to manage updates between trade, cargo, and inventory.

## 2. Technologies Used
   
Backend Framework: Node.js with Express.js
Database: MongoDB (via Mongoose ORM)
WebSockets: ws library for real-time updates
Event Management: Node.js EventEmitter
API Testing: Postman
Package Manager: npm
Environment Variables: dotenv

## 3. Project Structure
   root
│   index.js              # Main server file
│   .env                   # Environment variables
│   package.json           # Project dependencies and scripts
|
├───config
|    ├──db.js               #configure database here
|
├───controllers
|    ├──cargoRoutes.js     # API for cargo
|    ├──tradeRoutes.js     # API for trades
|    └──inventoryRoutes.js # API for inventories
|
├───models
│   ├── Cargo.js           # MongoDB Schema for Cargo
│   ├── Trade.js           # MongoDB Schema for Trade
│   └── Inventory.js       # MongoDB Schema for Inventory
│
├───routes
│   ├── tradeRouters.js     #  routes for Trade
│   └── cargoRouters.js     #  routes for Cargo
│   └── inventoryRouters.js   #  routes for Inventory
├───utilis
|   ├── eventprocessing.js    # Handle all events 
|   └── errorHandler.js    # Handle error
|   └── notificationSys.js # Handle notifications
└───websockets
    └── websocketServer.js # WebSocket server implementation

## 4.Installation and Setup

    Step 1: Clone the Repository
        git clone <repository_url>
        cd <repository_folder>
    Step 2: Install Dependencies
         npm install
    Step3: Run the Project
          node index.js

## 5. API Endpoints
   1. /api/trades                       #intiate a new trade
   2. /api/getalltrades                 # fetch all trades from database
   3. /api/trades/:transactionId        # fetch specific trade
   4. /api/:transactionId/status        # update the specific trade status
   5. /api/cargo                        #intiate a new cargo
   6. /api/cargo/:shipmentId            #fetch specific cargo
   7. /api/cargo/:shipmentId/status     #update the specific cargo status
   8. /api/getallCargo                  # fetch all cargo from database
   9. /api/inventory/:stationId          # fetch inventory details by station id
   10. /api/getinventory                 # fetch all inventories from database
## 6. Event-Driven Architecture
    eventEmitter.js
          The eventprocessing.js file handles the event-driven communication between different parts of the system:

    Events:
      tradeCreated: Triggered when a trade is created, checks for cargo with the same destination and updates it.
      cargoUpdated: Triggered after the cargo is updated with trade items, then updates the inventory.
      criticalEvent: Sends notifications for critical issues.
      tradeUpdate: triggered when status of trade changes it send the notification to buyerabout the status.
## 7. WebSocket Real-Time Updates
        websocketServer.js
                  The WebSocket server sends real-time updates to clients. When trades or cargo updates are made, connected clients receive events such as tradeCreate, tradeUpdated, cargoUpdated, and                                criticalEvent.
                  WebSocket URL: ws://localhost:3000/api/updates/real-time
8. Error Handling
        All API routes include basic error handling with appropriate status codes (e.g., 400, 500).
        WebSocket error handling is performed using the ws.on('error') and ws.on('close') events.
