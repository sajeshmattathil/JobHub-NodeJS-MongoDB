import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key:process.env.API_KEY,
  api_secret:process.env.API_SECRET
});

const upload = cloudinary.uploader.upload('path_to_your_pdf_file.pdf', { resource_type: "raw" }, (error, result) => {
  if (error) {
    console.error(error);
  } else {
    console.log(result);
  }
});

export default upload