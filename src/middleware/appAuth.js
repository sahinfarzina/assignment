const jwt = require('jsonwebtoken')
const User = require('../models/usersModel')
const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse')

exports.protect = asyncHandler(async(req,res,next)=>{
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }
    if(!token){
        return next(new ErrorResponse('Provide authorization token to access this route',200))
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        let user = await User.findOne({_id:decoded._id,'token':token})
        if(!user){
            return next(new ErrorResponse('Authorization failed',401))
        }
        req.user = user
        next()
    }catch(err){
        console.log(err)
    }

})

