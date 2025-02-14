const mongoose = require('mongoose');
const roleSchema = new mongoose.Schema({ 
    title: String,
    description: String,
    permissions:{
        type: Array,
        default: []
    },
    deleted:{
        type: Boolean,
        default: false
    },
    deletedAt: Date,
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
const Role = mongoose.model('Roles', roleSchema, "roles");
module.exports = Role
