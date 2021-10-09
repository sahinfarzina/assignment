const auth = (req,res,next)=>{
    if(req.isAuthenticated()){
        if(req.hasOwnProperty('user')){
            if(req.user.user_type === 1 || req.user.user_type === 2){
                return next()
            }
        }
    }
    req.flash('error_msg','Please login to view this resource')
    res.redirect('/app/login')
}

const checkUserNotLogin = (req, res, next)=>{
    if(req.isAuthenticated()){
        if(req.hasOwnProperty('user')){
            if(req.user.user_type === 1 || req.user.user_type === 2){
                return res.redirect('/app/dashboard')
            }
        }
    }
    return next()
}
module.exports = {
    ensureAuthenticated:auth,
    checkUserNotLogin:checkUserNotLogin,
}