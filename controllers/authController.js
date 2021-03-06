const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    const {username, password} = req.body;
    try {
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            username: username, 
            password: hashPassword
        });
        req.session.user = newUser;
        res.status(201).json({
            status: "success",
            data: {
                username: username
            }
        })
    } catch (e) {
        res.status(400).json({
            status: "fail",
        });
    }
};

exports.login = async (req, res) => {
    const {username, password} = req.body;
    try {
        const user = await User.findOne({username});

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'incorrect username or password'
            })
        }
        const isCorrect = await bcrypt.compare(password, user.password);

        if(isCorrect){
            req.session.user = user;
            res.status(200).json({
                status: 'success'
            })
        } else {
            res.status(400).json({
                status: "fail",
                message: "incorrect username or password"
            })
        }
    } catch (e) {
        res.status(400).json({ 
            status: "fail",
        });
    }
}