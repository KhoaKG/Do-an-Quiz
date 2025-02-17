const mongoose = require('mongoose');
const generate = require("../helper/generate")
const orderSchema = new mongoose.Schema({ 
    cart_id: String,
    userInfo:{
        fullName: String,
        phone: String,
        address: String
    },
    products: [
        {
            product_id: String,
            quantity: Number,
            price: Number,
            discountPercentage: Number
        }
    ],
    order_code: {
        type: String,
        default: generate.generateRandomNumber(9)
    },
    status: {
        type: String,
        default: "inactive"
    },
    updatedBy:[
        {
            account_id: String,
            updateAt: Date
        }    
    ],
    user_id: String
 },{
    timestamps: true
 })
const Order = mongoose.model('Order', orderSchema, "orders");
module.exports = Order
