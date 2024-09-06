const express = require('express');
const router = express.Router();
const { getInventory, getAllinventory } = require("../controllers/inventoryRoute");

router.get('/inventory/:stationId', getInventory);
router.get('/getinventory', getAllinventory);

module.exports = router