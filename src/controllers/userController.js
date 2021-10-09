const User = require('../models/usersModel')
const URL = require('../models/urlModel')
const passport = require('passport')
const layout = 'layouts/app_layout';


//@desc render view for app login page
//route GET /app/signup
//@access Public
exports.signup = async(req,res,next)=>{
    res.render('app/signup',{ layout: false })
}

//@desc save new user information
//route POST /app/signup
exports.createUser = async(req,res,next)=>{
    if(!req.body.email){
        req.flash('error_msg','Please provide email')
        return res.redirect('/app/signup')
    }
    if(!req.body.password){
        req.flash('error_msg','Please provide password')
        return res.redirect('/app/signup')
    }
    let userObj = new User({
        full_name:(req.body.full_name) ? req.body.full_name :'',
        email:req.body.email,
        password:req.body.password,
        user_type:2
    })
    await userObj.save()
    req.flash('success_msg','Your account has been created successfully')
    res.redirect('/app/login')
}

//@desc render view for app login page
//route GET /app/login
//@access Public
exports.login = async(req,res,next)=>{
    res.render('app/login',{ layout: false })
}

//@desc app login
//route POST /app/login
//@access Private
exports.doLogin = async(req,res,next)=>{
    if(!req.body.email){
        req.flash('error_msg','Please provide email')
        return res.redirect('/app/login')
    }
    if(!req.body.password){
        req.flash('error_msg','Please provide password')
        return res.redirect('/app/login')
    }
    passport.authenticate('local',{
        successRedirect:'/app/dashboard',
        failureRedirect:'/app/login',
        failureFlash:true
    })(req,res,next);
}

//@desc app dashboard
//route GET /app/dashboard
//@access Private
exports.dashboard = async(req,res,next)=>{
    let loggedUser = req.user;
    let data = {
        loggedUser,
        page_title:'Dashboard'
    }
    let records = await URL.find({is_deleted:0})
    console.log(records)
    data.list = records
    res.render('app/dashboard',{layout,data})
}

//@desc app create short url
//route POST /app/make-shorturl
//@access Private
exports.makeShortUrl = async(req,res,next)=>{
    console.log(req.body)
    await URL.create({user:req.user._id,actual_url:req.body.url})
    req.flash('success_msg','Record saved successfully')
    res.redirect('/app/dashboard')
}

//@desc app visit short url & update no of clicks
//route GET /app/visit-shorturl/:url
//@access Private
exports.visitShortUrl = async(req,res,next)=>{
    console.log(req.params.url)
    const url = req.params.url
    let record = await URL.findOne({short_url:url})
    if(!record){
        req.flash('error_msg','Record does not exist')
        return res.redirect('/app/dashboard')
    }
    record.no_clicks++
    await record.save()
    res.redirect(record.actual_url)
}

//@desc app logout
//route POST /app/logout
//@access Private
exports.logout = async(req,res,next)=>{
    req.logout()
    req.flash('success_msg','You are logged out')
    res.redirect('/app/login')
}