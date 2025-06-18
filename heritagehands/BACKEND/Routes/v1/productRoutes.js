const productRouter = require('express').Router()
const upload = require('../../middleware/multer')
const {create} = require('../../Controllers/productController')
const  authAdmin  = require('../../middleware/authAdmin')
const {listProduct} = require('../../Controllers/productController')
const {productDetails} = require('../../Controllers/productController')
const {updateProduct} = require('../../Controllers/productController')
const {deleteProduct} = require('../../Controllers/productController')

productRouter.post('/create',authAdmin,upload.single('image'),create)
productRouter.get('/listproducts',listProduct)
productRouter.get('/productdetails/:productId',productDetails)
productRouter.put('/update/:productId',authAdmin,upload.single("image"),updateProduct)
productRouter.delete('/delete/:productId',authAdmin,deleteProduct)


module.exports=productRouter