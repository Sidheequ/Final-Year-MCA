const adminDb=require('../Models/adminModel');
const vendorDb=require('../Models/vendorModel');
const userDb=require('../Models/userModel');
const productDb=require('../Models/productModel');
const orderDb=require('../Models/orderModel');
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
        res.cookie("Admin_token", token, { 
          sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', 
          secure: process.env.NODE_ENV === 'production',
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        return res.status(200).json({ message: "admin login successfull", adminExist, token })

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

// Get Admin Dashboard Statistics
const getDashboardStats = async (req, res) => {
    try {
        // Get total sales
        const totalSalesResult = await orderDb.aggregate([
            { $match: { orderStatus: { $in: ['Delivered', 'Shipped'] } } },
            { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } }
        ]);
        const totalSales = totalSalesResult.length > 0 ? totalSalesResult[0].totalSales : 0;

        // Get total orders
        const totalOrders = await orderDb.countDocuments();

        // Get total products
        const totalProducts = await productDb.countDocuments();

        // Get total customers
        const totalCustomers = await userDb.countDocuments();

        // Get recent orders (last 10)
        const recentOrders = await orderDb.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('userId', 'name email')
            .populate('products.productId', 'title image price');

        // Get monthly sales for analytics
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        
        const currentMonthSales = await orderDb.aggregate([
            { $match: { createdAt: { $gte: startOfMonth }, orderStatus: { $in: ['Delivered', 'Shipped'] } } },
            { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } }
        ]);

        const lastMonthSales = await orderDb.aggregate([
            { $match: { createdAt: { $gte: lastMonth, $lt: startOfMonth }, orderStatus: { $in: ['Delivered', 'Shipped'] } } },
            { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } }
        ]);

        const currentMonthTotal = currentMonthSales.length > 0 ? currentMonthSales[0].totalSales : 0;
        const lastMonthTotal = lastMonthSales.length > 0 ? lastMonthSales[0].totalSales : 0;
        const salesGrowth = lastMonthTotal > 0 ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1) : 0;

        res.status(200).json({
            totalSales: totalSales.toFixed(2),
            totalOrders,
            totalProducts,
            totalCustomers,
            salesGrowth: salesGrowth > 0 ? `+${salesGrowth}%` : `${salesGrowth}%`,
            recentOrders
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get All Products (Admin)
const getAllProducts = async (req, res) => {
    try {
        const products = await productDb.find()
            .populate('vendorId', 'name shopName')
            .sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Add New Product (Admin)
const addProduct = async (req, res) => {
    try {
        const { title, description, category, price, quantity, image } = req.body;
        
        if (!title || !description || !category || !price || !quantity) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        const newProduct = new productDb({
            title,
            description,
            category,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            image: image || '',
            // Admin-created products don't have a vendor
            vendorId: null
        });

        const savedProduct = await newProduct.save();
        res.status(201).json({ message: "Product added successfully", product: savedProduct });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update Product (Admin)
const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const updateData = req.body;

        const product = await productDb.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Update only provided fields
        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                if (key === 'price') {
                    product[key] = parseFloat(updateData[key]);
                } else if (key === 'quantity') {
                    product[key] = parseInt(updateData[key]);
                } else {
                    product[key] = updateData[key];
                }
            }
        });

        const updatedProduct = await product.save();
        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete Product (Admin)
const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await productDb.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await productDb.findByIdAndDelete(productId);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get All Customers (Admin)
const getAllCustomers = async (req, res) => {
    try {
        const customers = await userDb.find()
            .select('-password')
            .sort({ createdAt: -1 });
        res.status(200).json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get All Orders (Admin)
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderDb.find()
            .populate('userId', 'name email')
            .populate('products.productId', 'title image price')
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Sales Analytics (Admin)
const getSalesAnalytics = async (req, res) => {
    try {
        const { period = 'month' } = req.query;
        let startDate, endDate;

        const currentDate = new Date();
        
        if (period === 'week') {
            startDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else if (period === 'month') {
            startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        } else if (period === 'year') {
            startDate = new Date(currentDate.getFullYear(), 0, 1);
        }

        const salesData = await orderDb.aggregate([
            { $match: { createdAt: { $gte: startDate }, orderStatus: { $in: ['Delivered', 'Shipped'] } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    totalSales: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);

        res.status(200).json(salesData);
    } catch (error) {
        console.error('Error fetching sales analytics:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Vendor Details (Admin)
const getVendorDetails = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const vendor = await vendorDb.findById(vendorId).select('-password -confirmpassword');
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        res.status(200).json(vendor);
    } catch (error) {
        console.error('Error fetching vendor details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get Products for a Vendor (Admin)
const getVendorProductsForAdmin = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const products = await productDb.find({ vendorId });
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching vendor products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports={
    register,
    login,
    logout,
    getAllVendors,
    approveVendor,
    rejectVendor,
    deleteVendor,
    getDashboardStats,
    getAllProducts,
    getAllCustomers,
    getAllOrders,
    getSalesAnalytics,
    addProduct,
    updateProduct,
    deleteProduct,
    getVendorDetails,
    getVendorProductsForAdmin
}