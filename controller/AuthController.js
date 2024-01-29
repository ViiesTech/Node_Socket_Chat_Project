const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken')
const User = require('../models/UserModel.js')
class AuthController {
    static Register = async (req, res) => {

        const { name, email, password, tc } = req.body;
        const user = await User.findOne({ email: email });

        if (user) {
            res.send({ "status": "failed", "message": "Email already exists" })

        } else {
            if (name && email && password && tc) {
                try {
                    const salt = await bcrypt.genSalt(10)
                    const HashPassword = await bcrypt.hash(password, salt)

                    const CreateAccount = new User({
                        name: name,
                        email: email,
                        password: HashPassword,
                        tc: tc,
                    })

                    CreateAccount.save().then(async () => {

                        const Saved_user = await User.findOne({ email: email })

                        if (Saved_user) {

                            const token = JWT.sign({ UserID: Saved_user._id }, "JohnRadarpoiuytrewq", { expiresIn: "30d" })
                            res.send({ "status": "true", "message": "Registered successfully", "token": token })
                        } else {
                            res.send({ "status": "false", "message": "Registration Failed", })

                        }
                    })





                } catch (e) {
                    res.send({ "status": "failed", "message": "Resgistration failed", "error": e.message })

                }
            } else {
                res.send({ "status": "failed", "message": "All fields are required" })

            }
        }
    }

    static Login = async (req, res) => {
        const { email, password } = req.body;

        // Check if the user exists with the given email
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.send({ "status": "failed", "message": "User Not Exist" });
        }

        if (email && password) {
            const isHashMatch = await bcrypt.compare(password, user.password);
            if (isHashMatch) {
                // Generate a JWT token and send the user's data without the password
                const token = JWT.sign({ UserID: user._id }, "JohnRadarpoiuytrewq", { expiresIn: '30d' });
                const userData = { _id: user._id, name: user.name, email: user.email, tc: user.tc };

                return res.send({
                    "status": "Success",
                    "message": "Successfully logged in",
                    "token": token,
                    "data": userData
                });
            } else {
                return res.send({ "status": "failed", "message": "Incorrect password" });
            }
        } else {
            return res.send({ "status": "failed", "message": "All fields are required" });
        }
    }
}

module.exports = AuthController