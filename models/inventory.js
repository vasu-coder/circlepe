const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  stationId: {  type: mongoose.Schema.Types.ObjectId, required: true },
  items: [{ name: String, quantity:{type:Number,default:0} }],
}, { timestamps: true });

module.exports = mongoose.model('Inventory', InventorySchema);