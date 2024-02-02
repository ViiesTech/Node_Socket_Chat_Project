const mongoose  = require("mongoose");

const ChatSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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

const MessageModal = mongoose.model('ChatModel', ChatSchema)

module.exports  =  MessageModal