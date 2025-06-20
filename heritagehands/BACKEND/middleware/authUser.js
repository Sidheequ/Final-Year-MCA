const jwt = require("jsonwebtoken")

const authUser = (req, res, next) => {
    try {

        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ error: 'jwt not found' })
        }

        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET)
        if (!verifiedToken) {
            return res.status(401).json({ error: "User not authorized" })
        }

        // Check if role exists and is not 'user' (allow default 'user' role)
        if (verifiedToken.role && verifiedToken.role !== "user") {
            return res.status(401).json({ error: "Access denied" })
        }

        req.user = verifiedToken.id

        next()
    } catch (error) {

        res.status(error.status || 401).json({ error: error.message || "user authorization failed" })
    }
}

module.exports = authUser