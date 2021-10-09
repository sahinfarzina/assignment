const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const ErrorResponse = require('../utils/errorResponse')

const userSchema = new mongoose.Schema({
    full_name:{
        type:String,
        trim:true,
        maxlength:[30,'First name can not be more than 30 character']
    },
    email:{
        type:String,
        trim:true,
        required:true,
        match:[
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,64})+$/,'Please add a valid email'
        ]
    },
    password:{
        type:String,
        required:true,
        minlength:[8,'Password should contain atleast 8 characters']
    },
    user_type:{
        type:Number,
        default:2 // 1 => Super Admin, 2 => User
    },
    contact_no:{
        type:String,
        default:'',
        match:[/^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/, 'Contact no format must be of (xxx) xxx-xxxx']
    },
    
    token:{
        type:String,
    },
    device_type:{
        type:Number,
        default:0
    },
    device_push_key:{
        type:String,
        default:''
    },
    created_at:{
        type:Date,
        default: Date.now
    },
    updated_at:{
        type:Date,
        default: Date.now
    },
    is_active:{
        type:Number,
        default:1 // 1=active,0=inactive
    },
    is_deleted:{
        type:Number,
        default:0
    }
})

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.token
    delete userObject.created_at
    delete userObject.updated_at
    delete userObject.__v
    return userObject
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    //user.tokens = user.tokens.concat({token})
    user.token = token
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async(email,password)=>{
    const user = await User.findOne({email,is_deleted:0})
    if(!user){
        throw new ErrorResponse('Email does not exist',200)
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new ErrorResponse('Invalid login credentials',200)
    }
    return user
}

userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

const User = mongoose.model('User',userSchema)
module.exports = User

