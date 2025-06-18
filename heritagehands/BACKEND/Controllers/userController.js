const userDb = require("../Models/userModel")
const { createToken } = require("../Utilities/generateToken")
const { hashPassword, comparePassword } = require("../Utilities/passwordUtilities")

const register = async (req, res) => {
    try {
        const { name, email, phone, password, confirmpassword } = req.body
        console.log(req.body, "user created");


        if (!name || !email || !phone || !password || !confirmpassword) {
            return res.status(400).json({ error: "All fields are required" })
        }

        if (password !== confirmpassword) {
            return res.status(400).json({ error: "Passwords does not match" })
        }
        const userExist = await userDb.findOne({ email })

        if (userExist) {
            return res.status(400).json({ error: "Email already exist" })
        }

        const hashedPassword = await hashPassword(password)

        const newUser = new userDb({
            name, email, phone, password: hashedPassword, confirmpassword
        })

        const saved = await newUser.save()
        if (saved) {
            const token = createToken(saved._id)
            // res.cookie("token", token)
            res.cookie("token", token,{sameSite:"None", secure:true});
            return res.status(200).json({ message: "user Created" })
        }
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" })
        }
        const userExist = await userDb.findOne({ email })
        if (!userExist) {
            return res.status(400).json({ error: "User Not found" })
        }

        const passwordMatch = await comparePassword(password, userExist.password)
        if (!passwordMatch) {
            return res.status(400).json({ error: "Passwords does not match" })
        }
        const token = createToken(userExist._id)
        res.cookie("token", token,{sameSite:"None", secure:true});
        return res.status(200).json({ message: "user login successfull", userExist })

    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}

const logout = (req, res) => {
    try {
        res.clearCookie("token")
        res.status(200).json({ message: 'Logged Out' })
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}




module.exports = {
    register,
    login,
    logout
}
