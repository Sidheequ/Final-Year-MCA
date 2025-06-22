const jwt= require("jsonwebtoken");

const authAdmin = (req, res,next) => {
    try{
        console.log('Admin auth middleware - cookies:', req.cookies);
        const{Admin_token}=req.cookies;
        console.log('Admin token found:', !!Admin_token);
        
        if(!Admin_token){
            console.log('No Admin_token found in cookies');
            return res.status(401).json({ error: "jwt not authorised" });
        }

        const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
        const verifiedToken= jwt.verify(Admin_token, JWT_SECRET);
        console.log('Verified token:', verifiedToken);
        
        if(!verifiedToken){
            console.log('Token verification failed');
            return res.status(401).json({ error: "admin not authorised" });
        }
        if(verifiedToken.role !== "admin"){
            console.log('Token role is not admin:', verifiedToken.role);
            return res.status(403).json({ error: "access denied" });
        }

        console.log('Admin authentication successful');
        req.admin = verifiedToken.id; // Store the admin ID in the request object
        next(); // Call the next middleware or route handler
    }catch(error){
        console.error("Admin authorization error:", error);
        res.status(500).json({ error:error.message || "admin authorisation failed" });
    }

}

module.exports = authAdmin;
