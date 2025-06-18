const jwt= require("jsonwebtoken");

const authAdmin = (req, res,next) => {
    try{
        const{Admin_token}=req.cookies;
        if(!Admin_token){
            return res.status(401).json({ error: "jwt not authorised" });
        }

        const verifiedToken= jwt.verify(Admin_token, process.env.JWT_SECRET);
        if(!verifiedToken){
            return res.status(401).json({ error: "admin not authorised" });
        }
        if(verifiedToken.role !== "admin"){
            return res.status(403).json({ error: "access denied" });
        }

        req.admin = verifiedToken.id; // Store the admin ID in the request object
        next(); // Call the next middleware or route handler
    }catch(error){
        console.error("Admin authorization error:");
        res.status(500).json({ error:error.message || "admin authorisation failed" });
    }

}

module.exports = authAdmin;
