const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  stationId: {  type: mongoose.Schema.Types.ObjectId, required: true },
  items: [{ name: String, quantity: Number }],
}, { timestamps: true });

module.exports = mongoose.model('Inventory', InventorySchema);