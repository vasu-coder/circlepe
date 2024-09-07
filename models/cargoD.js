const mongoose = require("mongoose");

const cargoSchema = new mongoose.Schema({
    shipmentId: { type: String, required: true ,unique: true },
    emailId:{type:String,required:true},
    items: [{ name: String, quantity: Number }],
    status: { type: String,
        enum: ['pending', 'in transit', 'delayed', 'delivered'],
         default: 'pending' },
         destination:{type:String, required:true}
},{timestamps:true});
module.exports = mongoose.model('Cargo',cargoSchema);