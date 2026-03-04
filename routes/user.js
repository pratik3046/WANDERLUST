const express = require('express')
const Router = express.Router({ mergeParams: true })

const User=require('../models/user')
const wrapAsync = require('../utils/wrapAsync')
const passport = require('passport')
const { savedUrl } = require('../middleware')
const controllersUser=require("../controllers/user")

Router.get("/signup",controllersUser.renderSignupForm)

Router.post("/signup",wrapAsync(controllersUser.signUp))


Router.get("/login",   controllersUser.renderLoginForm)

Router.post("/login",
    savedUrl,
    passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash: true,
}),wrapAsync(controllersUser.login))

Router.get("/logout",controllersUser.logout)
module.exports=Router