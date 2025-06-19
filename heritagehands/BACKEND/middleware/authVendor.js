const jwt = require('jsonwebtoken');
const vendorDb = require('../Models/vendorModel');

const authVendor = async (req, res, next) => {
    try {
        const token = req.cookies.vendorToken;

        if (!token) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const vendor = await vendorDb.findById(decoded.id).select('-password');

        if (!vendor) {
            return res.status(401).json({ error: "Invalid token." });
        }

        if (!vendor.isApproved) {
            return res.status(401).json({ error: "Account not approved yet." });
        }

        req.vendor = vendor;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: "Invalid token." });
    }
};

module.exports = authVendor; 