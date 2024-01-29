const mongoose  = require("mongoose");

const ChatSchema = mongoose.Schema({
    sender: {
          type: String,
        require: true
    },
    receiver: {
       type: String,
        require: true
    },
    text: {
        type: String,
        require: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
})

const ChatModel = mongoose.model('ChatModel', ChatSchema)

module.exports  =  ChatModel