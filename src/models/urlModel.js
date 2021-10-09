const mongoose = require('mongoose')
const shortId = require('shortid')

const urlSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
    actual_url:{
        type:String,
        required:true,
        trim:true,
        match:[/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/]
    },
    short_url:{
        type:String,
        required:true,
        default:shortId.generate
    },
    no_clicks:{
        type:Number,
        default:0
    },
    is_deleted:{
        type:Number,
        default:0
    }
})

urlSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.__v
    return userObject
}

const URL = mongoose.model('URL',urlSchema)
module.exports = URL