const User = require('../models/UserModel.js')
const AllChatUsers = require('../models/ChatUsersModal.js')
class MainController {
    static getUser = async (req, res) => {
        const { id } = req.body

        const data = await User.find({ _id: { $ne: id } })
        res.send({
            "status": "success",
            "message": "your. id",
            "data": data
        })
    }


    static getAllChatUsers = async (req, res) => {
        const { id } = req.body



        const existingChats = await AllChatUsers.find({
            $or: [
                { sender_id: id },
                { receiver_id: id },
            ]
        });

        res.send({
            "success": true,
            "data": existingChats
        });
    }
}


module.exports = MainController