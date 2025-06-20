const vendorDb = require("../Models/vendorModel")
const productDb = require("../Models/productModel")
const { createToken } = require("../Utilities/generateToken")
const { hashPassword, comparePassword } = require("../Utilities/passwordUtilities")
const { uploadToCloudinary } = require('../Utilities/imageUpload')

// Vendor Registration
const register = async (req, res) => {
    try {
        const { name, email, phone, password, confirmpassword, shopName, address } = req.body
        console.log(req.body, "vendor created");

        if (!name || !email || !phone || !password || !confirmpassword || !shopName || !address) {
            return res.status(400).json({ error: "All fields are required" })
        }

        if (password !== confirmpassword) {
            return res.status(400).json({ error: "Passwords does not match" })
        }

        const vendorExist = await vendorDb.findOne({ email })

        if (vendorExist) {
            return res.status(400).json({ error: "Email already exist" })
        }

        const hashedPassword = await hashPassword(password)

        const newVendor = new vendorDb({
            name, email, phone, password: hashedPassword, confirmpassword, shopName, address
        })

        const saved = await newVendor.save()
        if (saved) {
            const token = createToken(saved._id)
            res.cookie("vendorToken", token, { sameSite: "None", secure: true });
            return res.status(200).json({ message: "Vendor Created Successfully" })
        }
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}

// Vendor Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" })
        }
        const vendorExist = await vendorDb.findOne({ email })
        if (!vendorExist) {
            return res.status(400).json({ error: "Vendor Not found" })
        }

        const passwordMatch = await comparePassword(password, vendorExist.password)
        if (!passwordMatch) {
            return res.status(400).json({ error: "Passwords does not match" })
        }

        if (!vendorExist.isApproved) {
            return res.status(400).json({ error: "Your account is pending approval" })
        }

        const token = createToken(vendorExist._id)
        res.cookie("vendorToken", token, { sameSite: "None", secure: true });
        return res.status(200).json({ message: "Vendor login successful", vendorExist })

    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}

// Vendor Logout
const logout = (req, res) => {
    try {
        // Clear the vendor token cookie with proper options
        res.clearCookie("vendorToken", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            path: "/"
        });
        res.status(200).json({ message: 'Vendor Logged Out Successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error during vendor logout" });
    }
}

// Create Product (Vendor specific)
const createProduct = async (req, res) => {
    try {
        const { title, description, category, price, quantity } = req.body;
        const vendorId = req.vendor._id; // From auth middleware

        if (!title || !description || !category || !price || quantity === undefined) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        const cloudinaryRes = await uploadToCloudinary(req.file.path);

        const newProduct = new productDb({
            title,
            description,
            category,
            price,
            quantity,
            image: cloudinaryRes.secure_url,
            vendorId: vendorId
        });

        const savedProduct = await newProduct.save();

        return res.status(201).json({
            message: "Product created successfully",
            product: savedProduct
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Vendor's Products
const getVendorProducts = async (req, res) => {
    try {
        const vendorId = req.vendor._id;
        const products = await productDb.find({ vendorId: vendorId });
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update Product (Vendor specific)
const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { title, description, category, price, quantity } = req.body;
        const vendorId = req.vendor._id;

        let imageUrl;

        const existingProduct = await productDb.findOne({ _id: productId, vendorId: vendorId });
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found or unauthorized" });
        }

        if (req.file) {
            const cloudinaryRes = await uploadToCloudinary(req.file.path);
            imageUrl = cloudinaryRes.secure_url;
        } else {
            imageUrl = existingProduct.image;
        }

        const updatedProduct = await productDb.findByIdAndUpdate(
            productId,
            { title, description, category, price, quantity, image: imageUrl },
            { new: true }
        );

        res.status(200).json({ message: "Product updated successfully", updatedProduct });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete Product (Vendor specific)
const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const vendorId = req.vendor._id;

        const existingProduct = await productDb.findOne({ _id: productId, vendorId: vendorId });
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found or unauthorized" });
        }

        await productDb.findByIdAndDelete(productId);

        res.status(200).json({ message: "Product deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    register,
    login,
    logout,
    createProduct,
    getVendorProducts,
    updateProduct,
    deleteProduct
} 