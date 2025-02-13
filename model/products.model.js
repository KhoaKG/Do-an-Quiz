const mongoose = require('mongoose');
slug = require('mongoose-slug-updater')
mongoose.plugin(slug)
const productsSchema = new mongoose.Schema({ 
    slug: { 
        type: String, 
        slug: "title",
        unique:true
    },
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
},{
    timestamps: true
});

const Product = mongoose.model('Product', productsSchema, "products");

module.exports = Product