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
    deletedAt: Date,
    product_category_id:{
        type:String,
        default: ""
    },
    createdBy:{
        account_id: String,
        createAt: {
            type: Date,
            default: Date.now
        }
    },
    deletedBy:{
        account_id: String,
        deleteAt: Date
    },
    updatedBy:[
        {
            account_id: String,
            updateAt: Date
        }    
    ],
    featured: String,
},{
    timestamps: true
});

const Product = mongoose.model('Product', productsSchema, "products");

module.exports = Product