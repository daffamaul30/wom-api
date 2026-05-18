const cloudinary = require("../config/cloudinary");

const deleteOnCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      return;
    }

    const result = await cloudinary.uploader.destroy(publicId);

    return result;
  } catch (error) {
    console.error("Gagal menghapus file Cloudinary:", error.message);

    throw error;
  }
};

module.exports = deleteOnCloudinary;
