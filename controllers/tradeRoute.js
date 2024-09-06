const Trade = require("../models/trade");
const eventEmitter = require("../utilis/eventEmitter");

// Create a new trade transaction
exports.createTrade = async (req, res) => {
  try {
    const trade = new Trade(req.body);
    trade.status = 'pending';
    trade.transactionId = trade._id;
    await trade.save();
    const emailId = trade.buyerEmail;
    eventEmitter.emit('tradeUpdated',trade,emailId);
    res.status(201).json(trade);

    if(trade.items.length>5){
        trade.status = 'delayed';
        await trade.save();

        eventEmitter.emit('criticalEvent', { message: 'Delayed shipment detected!', trade, emailId });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getAlltrade=async(req,res)=>{
    try {
        const trade = await Trade.find().select("transactionId");
        if (!trade) return res.status(404).json({ message: 'Trade not found' });
        res.status(200).json(trade);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
}
// Get details of a trade transaction
exports.getTrade = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.transactionId);
    if (!trade) return res.status(404).json({ message: 'Trade not found' });
    res.status(200).json(trade);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateTrade = async(req,res)=>{
    try {
        const { status } = req.body; // Expecting the new status in the request body
        const trade = await Trade.findOne({ transactionId: req.params.transactionId });

        if (!trade) {
            return res.status(404).json({ error: 'Trade not found' });
        }

        trade.status = status;
        await trade.save();
        eventEmitter('tradeUpdated',trade);
        res.json({ message: 'Trade status updated', trade });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update trade status' });
    }
};