//require these npm to be installed before running
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
var uniqueValidator = require('mongoose-unique-validator');

//create user schema with mongoose, the two fields required for a user is a username and password 
const UserSchema = new mongoose.Schema({
    username:String,
    password:String
}) ;

//plugins
UserSchema.plugin(passportLocalMongoose);
//if the user name is taken then it prompts the user that this name has been used
UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});

//the user model 
module.exports = mongoose.model("User", UserSchema);