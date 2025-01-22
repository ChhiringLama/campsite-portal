const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
});

const storage=new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Campsite',         // Folder where images will be stored in Cloudinary
        allowed_formats: ['jpeg', 'jpg', 'png'] // Allowed image formats
    }
});

module.exports={
    cloudinary,
    storage
}