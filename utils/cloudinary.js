const cloudinary = require('cloudinary').v2;
require('dotenv').config();
cloudinary.config({
    cloud_name:process.env.cloud_name,
    api_key:process.env.could_api_key,
    api_secret:process.env.could_api_secret
})

module.exports = cloudinary;