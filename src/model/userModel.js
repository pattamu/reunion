const mongoose = require('mongoose')
const ObjectId = mongoose.SchemaTypes.ObjectId

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        trim: true
    },
    email: {
        type: String, 
        required: true, 
        unique:true, 
        trim: true, 
        lowercase: true
    },
    phone: {
        type: String, 
        unique:true, 
        trim: true
    }, 
    password: {
        type: String, 
        required: true
    },
    followers: {
        type: [ObjectId], 
        ref: 'User'
    },
    followings: {
        type: [ObjectId], 
        ref: 'User'
    }
},
{timestamps:true})

const userModel = mongoose.model('User', userSchema)//users

module.exports = {userModel}