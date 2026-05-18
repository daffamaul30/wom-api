const cloudinary = require("../config/cloudinary");

const uploadPdfToCloudinary = async (
  filePath,
  folder = "wedding-organizer/documents/guidebooks",
) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: folder,
  });
};

module.exports = uploadPdfToCloudinary;
