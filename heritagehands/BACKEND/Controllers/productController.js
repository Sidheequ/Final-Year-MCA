// Controllers/productController.js

const productDb = require('../Models/productModel');
const { uploadToCloudinary } = require('../Utilities/imageUpload');

const create = async (req, res) => {
    try {
        const { title, description, category, price } = req.body;

        if (!title || !description || !category || !price) {
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
            image: cloudinaryRes.secure_url
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

const listProduct = async (req, res) => {
    try {
        const productList = await productDb.find();
        res.status(200).json({message: "Product list retrieved", productList}); // Directly sending array
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const productDetails = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await productDb.findById(productId).populate('vendorId', 'name shopName');

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { title, description, category, price } = req.body;

        let imageUrl;

        const existingProduct = await productDb.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (req.file) {
            const cloudinaryRes = await uploadToCloudinary(req.file.path);
            imageUrl = cloudinaryRes.secure_url;
        } else {
            imageUrl = existingProduct.image;
        }

        const updatedProduct = await productDb.findByIdAndUpdate(
            productId,
            { title, description, category, price, image: imageUrl },
            { new: true }
        );

        res.status(200).json({ message: "Product updated successfully", updatedProduct });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const existingProduct = await productDb.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        await productDb.findByIdAndDelete(productId);

        res.status(200).json({ message: "Product deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    create,
    listProduct,
    productDetails,
    updateProduct,
    deleteProduct
};
