const express = require("express");
const router = express.Router();
const {createCargo,getCargo, updateCargo, getallCargo}= require('../controllers/cargoRoute');


router.post('/cargo',createCargo);
router.get('/cargo/:shipmentId',getCargo);
router.get('/getallCargo',getallCargo);
router.put('/cargo/:shipmentId/status',updateCargo);

module.exports=router;