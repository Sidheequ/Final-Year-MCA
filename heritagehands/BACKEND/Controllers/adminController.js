const adminDb=require('../Models/adminModel');
const vendorDb=require('../Models/vendorModel');
const { hashPassword } = require('../Utilities/passwordUtilities');
const { createToken } = require('../Utilities/generateToken');
const { comparePassword } = require('../Utilities/passwordUtilities');

const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }
        const alreadyExist = await adminDb.findOne({ email });
        if (alreadyExist) {
            return res.status(400).json({

                message: "Admin already exists"
            })
        }
        const hashedPassword = await hashPassword(password)
        const newAdmin = new  adminDb({
            email,password:hashedPassword
        })
        const saved = await newAdmin.save()

        if(saved){
            return res.status(200).json({message:"Admin created",saved})
        }

    } catch (error) {
        res.status(500).json({

            message: error.message
        })
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" })
        }
        const adminExist = await adminDb.findOne({ email })
        if (!adminExist) {
            return res.status(400).json({ error: "admin Not found" })
        }

        const passwordMatch = await comparePassword(password, adminExist.password)
        if (!passwordMatch) {
            return res.status(400).json({ error: "Passwords does not match" })
        }
        const token = createToken(adminExist._id,"admin")
        res.cookie("Admin_token", token, { sameSite: "None", secure: true });
        return res.status(200).json({ message: "admin login successfull", adminExist })

    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}

const logout= async(req,res)=>{
    try {

        res.clearCookie("Admin_token");
        return res.status(200).json({ message: "Logout successful" })
        
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
        
    }
}

// Get All Vendors (Admin)
const getAllVendors = async (req, res) => {
    try {
        console.log('getAllVendors called by admin:', req.admin);
        const vendors = await vendorDb.find().select('-password -confirmpassword');
        console.log('Found vendors:', vendors.length);
        console.log('Vendors data:', vendors);
        res.status(200).json(vendors);
    } catch (error) {
        console.error('Error fetching vendors:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Approve Vendor (Admin)
const approveVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;
        
        const vendor = await vendorDb.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        vendor.isApproved = true;
        vendor.isRejected = false;
        await vendor.save();

        res.status(200).json({ 
            message: "Vendor approved successfully",
            vendor: {
                _id: vendor._id,
                name: vendor.name,
                email: vendor.email,
                shopName: vendor.shopName,
                isApproved: vendor.isApproved,
                isRejected: vendor.isRejected
            }
        });
    } catch (error) {
        console.error('Error approving vendor:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Reject Vendor (Admin)
const rejectVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;
        
        const vendor = await vendorDb.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        vendor.isApproved = false;
        vendor.isRejected = true;
        await vendor.save();

        res.status(200).json({ 
            message: "Vendor rejected successfully",
            vendor: {
                _id: vendor._id,
                name: vendor.name,
                email: vendor.email,
                shopName: vendor.shopName,
                isApproved: vendor.isApproved,
                isRejected: vendor.isRejected
            }
        });
    } catch (error) {
        console.error('Error rejecting vendor:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete Vendor (Admin)
const deleteVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;
        
        const vendor = await vendorDb.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        await vendorDb.findByIdAndDelete(vendorId);

        res.status(200).json({ message: "Vendor deleted successfully" });
    } catch (error) {
        console.error('Error deleting vendor:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports={
    register,
    login,
    logout,
    getAllVendors,
    approveVendor,
    rejectVendor,
    deleteVendor
}