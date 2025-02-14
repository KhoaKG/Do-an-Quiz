const mongoose = require('mongoose');
slug = require('mongoose-slug-updater')
mongoose.plugin(slug)
const productsCategorySchema = new mongoose.Schema({ 
    title: String,
    parent_id:{
        type: String,
        default: ""
    },
    description: String,
    thumbnail: String,
    status: String,
    position: Number,
    deleted:{
        type: Boolean,
        default: false
    },
    deletedAt: Date,
    slug: { 
        type: String, 
        slug: "title",
        unique:true
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
    ]  
 },{
    timestamps: true
 })
const ProductsCategory = mongoose.model('ProductsCategory', productsCategorySchema, "products-category");
module.exports = ProductsCategory

