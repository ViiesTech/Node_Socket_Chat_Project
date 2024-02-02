const User = require('../models/UserModel.js')

class MainController {
    static getUser =  async(req, res) => {
        const {id} = req.body

        const data = await User.find({_id: {$ne : id}})
        res.send({
            "status": "success",
            "message": "your. id",
            "data" :data
        })
    }
}


module.exports = MainController