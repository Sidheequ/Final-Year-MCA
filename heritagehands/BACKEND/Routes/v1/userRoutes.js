const { register, login, logout, updatePassword, updateUserAddress, getUserProfile } = require('../../Controllers/userController')
const authUser = require('../../middleware/authUser')
const userRouter = require('express').Router()


userRouter.post("/register", register)
userRouter.post("/login", login)
userRouter.post("/logout", logout)
userRouter.patch("/update-password", authUser, updatePassword);
userRouter.patch("/address", authUser, updateUserAddress);
userRouter.get("/profile", authUser, getUserProfile);

module.exports = userRouter