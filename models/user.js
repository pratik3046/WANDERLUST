const mongoose = require('mongoose')
const Schema = mongoose.Schema 
const passportlocalmongoose = require("passport-local-mongoose")


const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
})

userSchema.plugin(passportlocalmongoose.default)// it will automatically add the username , password ,hashing and salting to the Schema

module.exports = mongoose.model("User", userSchema)