const mongoose = require("mongoose")
const dotenv = require('dotenv') 

dotenv.config()

async function db(){
    try{
await mongoose.connect(
    process.env.MONGODB_URI, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
    }catch (error){
        console.error(error);
    }
}

module.exports =db