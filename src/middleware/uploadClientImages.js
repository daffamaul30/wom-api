const multer = require("multer");
const sharp = require("sharp");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
  { name: "bridePhoto", maxCount: 1 },
  { name: "groomPhoto", maxCount: 1 },
]);

const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const processImages = async (req, res, next) => {
  try {
    req.uploadedImages = {};

    if (req.files?.bridePhoto?.[0]) {
      const buffer = await sharp(req.files.bridePhoto[0].buffer)
        .resize(600, 600, { fit: "cover" })
        .jpeg({ quality: 80 })
        .toBuffer();

      const result = await uploadToCloudinary(
        buffer,
        "wedding-organizer/documents/images/bride",
      );

      // req.uploadedImages.bridePhoto = result.secure_url;
      req.uploadedImages.bridePhoto = {
        url: result.secure_url,
        publicId: result.public_id,
      };
    }

    if (req.files?.groomPhoto?.[0]) {
      const buffer = await sharp(req.files.groomPhoto[0].buffer)
        .resize(600, 600, { fit: "cover" })
        .jpeg({ quality: 80 })
        .toBuffer();

      const result = await uploadToCloudinary(
        buffer,
        "wedding-organizer/documents/images/groom",
      );

      // req.uploadedImages.groomPhoto = result.secure_url;
      req.uploadedImages.groomPhoto = {
        url: result.secure_url,
        publicId: result.public_id,
      };
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: "Upload gambar gagal",
      error: error.message,
    });
  }
};

module.exports = [upload, processImages];
