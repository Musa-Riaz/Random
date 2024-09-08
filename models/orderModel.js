const mongoose = require('mongoose')
const objectSchema = new mongoose.Schema({
    products: [
        {
            type:mongoose.ObjectId,
            ref:"Products"
        },
        
    ],
    payment:{},
    buyer:{
        type: mongoose.ObjectId,
        ref: "users"
    },
    status:{
        type:String,
        default:"Not Process",
        enum:["Not Process", "Processing", "Shipped", "delivered", "cancel"]
     }
}, {timestamps:true})

module.exports = mongoose.model("Order", objectSchema)