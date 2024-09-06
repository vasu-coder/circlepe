const express = require("express");
const router = express.Router();
const {createTrade,getTrade, getAlltrade, updateTrade}= require("../controllers/tradeRoute");


router.post('/trades',createTrade);
router.get('/getalltrades',getAlltrade);
router.get('/trades/:transactionId',getTrade);
router.put('/trades/:transactionId/status',updateTrade);

module.exports=router;