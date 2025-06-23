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
            const token = createToken(saved._id, 'user')
            res.cookie("token", token,{sameSite:"None", secure:true});
            return res.status(200).json({ message: "user Created", token })
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
        const token = createToken(userExist._id, 'user')
        // res.cookie("token", token,{sameSite:"None", secure:true});
        return res.status(200).json({ message: "user login successfull", userExist, token })

    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}

const logout = (req, res) => {
    try {
        // Clear the token cookie with proper options
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            path: "/"
        });
        res.status(200).json({ message: 'Logged Out Successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error during logout" });
    }
}

const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user; // From authUser middleware

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const user = await userDb.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const isMatch = await comparePassword(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect current password." });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long." });
        }

        user.password = await hashPassword(newPassword);
        await user.save();

        res.status(200).json({ message: "Password updated successfully." });

    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

const updateUserAddress = async (req, res) => {
    try {
        const userId = req.user;
        const { address, city, state, postalCode } = req.body;

        if (!address || !city || !state || !postalCode) {
            return res.status(400).json({ error: 'All address fields are required.' });
        }

        const updatedUser = await userDb.findByIdAndUpdate(
            userId,
            { $set: { shippingAddress: { address, city, state, postalCode } } },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json({ message: 'Address updated successfully.', user: updatedUser });

    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user;
        const user = await userDb.findById(userId).select('-password -confirmpassword');
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    register,
    login,
    logout,
    updatePassword,
    updateUserAddress,
    getUserProfile,
}
