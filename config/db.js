const mongoose =require('mongoose');

 const connectDB=  async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        const connection = mongoose.connection
        connection.on("connected",()=>{
            console.log("connection sucessfully with database");
        })
        connection.on("error",(error)=>{
            console.log("something went worng in database",error);
        })
    }

    catch(error){
        console.log("something went wrong ",error);
    }
 };
 module.exports = connectDB;