const User = require('../models/usersModel')
const URL = require('../models/urlModel')


//@desc app Registration
//route GET /api/signup
//@access Public
exports.signup = async(req,res,next)=>{
    console.log(req.body)
    if(!req.body.email){
        return res.send({success:false,message:"Please provide email"})
    }
    if(!req.body.password){
        return res.send({success:false,message:"Please provide password"})
    }
    let inputData = req.body
    var email = req.body.email
    const emailCheck = await User.findOne({email:email})
    if(emailCheck){
        return res.send({success:false,message:"Email already exist"})
    }
    let user = new User({
        full_name:(inputData.full_name) ? inputData.full_name: '',
        email:email,
        password:inputData.password,
        user_type:2,
        contact_no:(inputData.contact_no) ? inputData.contact_no : ''
    })
    if(req.body.company_name){
        user.company_name = req.body.company_name
    }
    
    await user.save()
    const token = await user.generateAuthToken()
    let userInfo = await User.findById(user._id).select({
        "email":1,
        "full_name":1,
        "contact_no":1,
        "user_type":1,
        "device_type":1,
        "device_push_key":1,
        "is_active":1
    })
    var userDetails = userInfo.toObject()
    
    res.send({success:true,data:{user:userDetails,token},message:"You have registered successfully"})
    
}

//@desc app Login
//route GET /api/login
//@access Public
exports.login = async(req,res,next)=>{
    console.log(req.body)
    if(!req.body.email){
        return res.send({success:false,message:"Please provide email"})
    }
    if(!req.body.password){
        return res.send({success:false,message:"Please provide password"})
    }
    const user = await User.findByCredentials(req.body.email,req.body.password,req.body.login_type)
    
    
    const token = await user.generateAuthToken()

    user.device_type = req.body.device_type
    if(req.body.device_push_key != undefined){
        user.device_push_key = req.body.device_push_key
    }
    await user.save()
    let userInfo = await User.findById(user._id).select({
        "email":1,
        "full_name":1,
        "contact_no":1,
        "user_type":1,
        "device_type":1,
        "device_push_key":1,
        "is_active":1
    })
    var userDetails = userInfo.toObject()
    
    res.send({
        success:true,
        message:'You have loggedin successfully',
        data:{user:userDetails,token}
    })
}

//@desc app dashboard
//route GET /api/dashboard
//@access Private
exports.dashboard = async(req,res,next)=>{
    let records = await URL.find({is_deleted:0})
    console.log(records)
    res.send({success:true,data:{records},message:""})
}

//@desc app create short url
//route POST /api/make-shorturl
//@access Private
exports.makeShortUrl = async(req,res,next)=>{
    console.log(req.body)
    await URL.create({user:req.user._id,actual_url:req.body.url})
    res.send({success:true,message:"Url added successfully"})
}

//@desc app visit short url & update no of clicks
//route GET /api/visit-shorturl/:url
//@access Private
exports.visitShortUrl = async(req,res,next)=>{
    console.log(req.params.url)
    const url = req.params.url
    let record = await URL.findOne({short_url:url})
    if(!record){
        res.send({success:true,message:"Record does not exist"})
    }
    record.no_clicks++
    await record.save()
    res.redirect(record.actual_url)
}


exports.logout = async(req,res,next)=>{

}