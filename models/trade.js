const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
    transactionId: { type: String, unique: true  },
    stationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Station'},
    buyer:{type:String ,
         required:true},

    buyerEmail:{type:String,required:true},
    seller:{type:String,
        required:true},
    sellerEmail:{type:String,required:true},
    items:[{
        name:{type:String ,
             required:true},
        quantity:{type:String,
            required:true}
    }],
    destination:{type:String,required:true} ,
    status:{type:String,
        enum: ['pending', 'completed', 'canceled'],
        default:'pending'}
},{timestamps:true});
module.exports = mongoose.model('Trade',tradeSchema);
