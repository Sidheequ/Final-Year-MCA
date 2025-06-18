const productDb = require('../Models/productModel')
const { uploadToCloudinary } = require('../Utilities/imageUpload')  

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
        console.log(cloudinaryRes, "image uploaded to cloudinary");

        const newProduct = new productDb({
            title,
            description,
            category,
            price,
            image: cloudinaryRes.secure_url // Use secure_url from cloudinary response
        });

        const savedProduct = await newProduct.save();
        if (savedProduct) {
            return res.status(201).json({ 
                message: "Product created successfully",
                product: savedProduct 
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            message: error.message || "Internal server error" 
        });
    }
};


const listProduct = async(req, res) => {
    try{
        const productsList = await productDb.find();
        res.status(200).json(productsList)
    }catch(error){
        console.log(error);
        res.status(500).json({ 
            message: error.message || "Internal server error" 
        });
    }


}

const productDetails= async(req,res)=>{
    try{

        const {productId}= req.params;

        const productDetails = await productDb.findById({_id:productId});
        if(!productDetails){
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json(productDetails);

    }catch(error){
        console.log(error);
        res.status(500).json({ 
            message: error.message || "Internal server error" 
        });
    }
}

const updateProduct =async(req,res)=>{
    try{

        const {productId} = req.params;
        const { title, description, category, price } = req.body;
        let imageUrl;



        let isProductExist = await productDb.findById(productId);
        if(!isProductExist){
            return res.status(404).json({ message: "Product not found" });
        }
        if(req.file){
            const cloudinaryRes =await uploadToCloudinary(req.file.path);
            imageUrl = cloudinaryRes
        }

        const updatedProduct = await productDb.findByIdAndUpdate(
            productId,
            {
                title,
                description,
                category,
                price,
                image: imageUrl
            },
            { new: true },
            res.status(400).json({message:"Product updated successfully",updateProduct})
        );
        res.status(400).json({ message: "Product updated successfully", updatedProduct });
        if (!updatedProduct) {
            return res.status(400).json({ message: "Product update failed" });
        }
        res.status(200).json({ message: "Product updated successfully", updatedProduct });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            message: error.message || "Internal server error" 
        });
    }
}


const deleteProduct =async(req,res)=>{
    try{
        const {productId} = req.params;

        const isProductExist = await productDb.findById(productId);

        const deleteProduct = await productDb.findByIdAndDelete(productId);
        
        if(!deleteProduct){
            return res.status(400).json({ message: "Product deletion failed" });
        }
        


        return res.status(200).json({ message: "Product deleted successfully" });
        


    }catch(error){
        console.log(error);
        res.status(500).json({ 
            message: error.message || "Internal server error" 
        });
    }
}

module.exports = {
    create,
    listProduct,
    productDetails,
    updateProduct,
    deleteProduct
};