const jwt = require('jsonwebtoken');
const vendorDb = require('../Models/vendorModel');

const authVendor = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'jwt not found' });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'jwt not found' })
        }

        const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
        const decoded = jwt.verify(token, JWT_SECRET);
        
        if (!decoded) {
            return res.status(401).json({ error: "Vendor not authorized" })
        }

        if (decoded.role !== "vendor") {
            return res.status(401).json({ error: "Access denied" })
        }

        req.vendor = decoded.id

        next()
    } catch (error) {
        res.status(error.status || 401).json({ error: error.message || "vendor authorization failed" })
    }
}

module.exports = authVendor; 