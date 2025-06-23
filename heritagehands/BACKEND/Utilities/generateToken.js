const jwt = require("jsonwebtoken")
const maxAge = 3 * 24 * 60 * 60

const createToken = (id, role='vendor') => {
    const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
    return jwt.sign({ id, role }, JWT_SECRET, {
        expiresIn: maxAge
    })
}

module.exports = { createToken }