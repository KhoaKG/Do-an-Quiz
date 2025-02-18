const mongoose = require('mongoose');
slug = require('mongoose-slug-updater')
mongoose.plugin(slug)
const blogsSchema = new mongoose.Schema({ 
    slug: { 
        type: String, 
        slug: "title",
        unique:true
    },
    title: String,
    description: String,
    status: String,
    position: Number,
    thumbnail: String,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
    blog_category_id:{
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
    ]        
},{
    timestamps: true
});

const Blog = mongoose.model('Blogs', blogsSchema, "blogs");

module.exports = Blog