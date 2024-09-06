const Inventory = require("../models/inventory");

exports.getAllinventory = async(req,res)=>{
    try {
        const inventory = await Inventory.find();
        res.status(200).json(inventory);
      } catch (error) {
      
        res.status(400).json({ error: error.message });
    }
}
// Get inventory for a specific space station
exports.getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findOne({ stationId: req.params.stationId });
    if (!inventory) return res.status(404).json({ message: 'Inventory not found' });
    res.status(200).json(inventory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};