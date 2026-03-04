const User=require("../models/user")

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs", { hideNavbar: true })
}


module.exports.signUp=async(req,res)=>{
    try{
    let {username,email,password}=req.body
    const newUser=new User({username,email})

    let registeredUser=await User.register(newUser,password)
    console.log(registeredUser)
    req.login(registeredUser,(err)=>{
       if(err){
        return next(err)
       }
       req.flash("success",`WELCOME TO WANDERLUST ${username}`)

    res.redirect("/listings")
    })
    
    }
    catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs", { hideNavbar: true })
}

module.exports.login=async(req,res)=>{
    

    req.flash("success","welcome to wanderlust!!")
    let redirectLink=res.locals.savedUrl||"/listings"
    res.redirect(redirectLink)
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","You are successfully Logged Out!!")
        res.redirect("/listings")
    })
}