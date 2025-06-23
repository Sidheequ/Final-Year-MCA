const { register, login, logout, updatePassword, updateUserAddress, getUserProfile } = require('../../Controllers/userController')
const authUser = require('../../middleware/authUser')
const userRouter = require('express').Router()
const { addToWishlist, removeFromWishlist, getWishlist } = require('../../Controllers/wishlistController')


userRouter.post("/register", register)
userRouter.post("/login", login)
userRouter.post("/logout", logout)
userRouter.patch("/update-password", authUser, updatePassword);
userRouter.patch("/address", authUser, updateUserAddress);
userRouter.get("/profile", authUser, getUserProfile);

// Wishlist routes
userRouter.post('/wishlist/add', authUser, addToWishlist);
userRouter.post('/wishlist/remove', authUser, removeFromWishlist);
userRouter.get('/wishlist', authUser, getWishlist);

module.exports = userRouter