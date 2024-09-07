const Cargo = require("../models/cargoD");
const eventEmitter = require('../utilis/eventprocessing')

// Create a new cargo shipment
exports.createCargo = async (req, res) => {
  try {
    const cargo = new Cargo(req.body);
    cargo.status='pending';
    
    await cargo.save();
    const emailId = cargo.emailId;
    eventEmitter.emit('cargoUpdated',cargo);
    res.status(201).json(cargo);



    if(cargo.items.length>10){
        cargo.status='delayed';
    await cargo.save();
    eventEmitter.emit('criticalEvent', { message: 'Delayed shipment detected!', cargo,emailId });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Get details of a cargo shipment
exports.getCargo = async (req, res) => {
  try {
    const cargo = await Cargo.findById(req.params.shipmentId);
    if (!cargo) return res.status(404).json({ message: 'Cargo not found' });
    res.status(200).json(cargo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getallCargo = async(req,res)=>{
    try {
        const cargo = await Cargo.find();
        if (!cargo) return res.status(404).json({ message: 'Cargo not found' });
        res.status(200).json(cargo);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
};

exports.updateCargo = async(req,res)=>{
    try {
        const { status } = req.body; // Expecting the new status in the request body
        const cargo = await Cargo.findOne({ shipmentId: req.params.shipmentId });

        if (!cargo) {
            return res.status(404).json({ error: 'Cargo not found' });
        }

        cargo.status = status;
        await cargo.save();

        // Emit event for cargo status update
        eventEmitter.emit('cargoUpdated', cargo);

        res.json({ message: 'Cargo status updated', cargo });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update cargo status' });
    }
};