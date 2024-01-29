const mongoose  = require("mongoose");


const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true, 
    },
    email:{
        type: String,
        require: true,
        unique: [true, "Email id already exists"],
    },
    isOnline: {
        type : Boolean,
    },
    password:{
        type: String,
        require: true
    },
    socketId : String
},{timestamps: true});


const User = mongoose.model('User', UserSchema)

module.exports  = User;