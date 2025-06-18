const cloudinary = require('../config/cloudinaryConfig');

const uploadToCloudinary = async (filePath) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            filePath,
            { folder: 'products' },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return reject(error);
                }
                resolve(result);
            }
        );
    });
};

module.exports = {
    uploadToCloudinary
};