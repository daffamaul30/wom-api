const path = require("path");
const fs = require("fs");

const Client = require("../models/client");

const Event = require("../models/event");

const generateDocx = require("./generateDocx");

const convertToPdf = require("./convertToPdf");

const uploadPdfToCloudinary = require("./uploadPdfToCloudinary");

const cloudinary = require("../config/cloudinary");
const {
  formatDateToIndonesian,
  refactorFormatTemplate,
} = require("../utils/helperFunction");

const deleteOnCloudinary = require("./deleteOnCloudinary");

const generateGuideBook = async (clientId) => {
  try {
    const client = await Client.findById(clientId);

    if (!client) {
      throw new Error("Client tidak ditemukan");
    }

    const events = await Event.find({
      clientId,
    }).sort({
      eventDate: 1,
      startTime: 1,
    });

    const akadEvent = events.find((event) => event.eventType === "akad");
    const resepsiEvent = events.find((event) => event.eventType === "resepsi");

    if (!akadEvent || !resepsiEvent) {
      console.log("Guidebook belum dibuat karena event belum lengkap");

      return null;
    }

    await deleteOnCloudinary(client.guideBookPublicId);
    if (client.guideBookPublicId) {
      await cloudinary.uploader.destroy(client.guideBookPublicId, {
        resource_type: "raw",
      });
    }

    const docxPath = path.join(__dirname, `../generated/${clientId}.docx`);

    const pdfPath = path.join(__dirname, `../generated/${clientId}.pdf`);

    // ====================
    // GENERATE DOCX
    // ====================
    const templateData = refactorFormatTemplate(
      client,
      akadEvent,
      resepsiEvent,
    );

    const { buffer } = await generateDocx({
      templatePath: path.join(__dirname, "../templates/panduan-acara.docx"),

      data: templateData,

      outputPath: docxPath,
    });

    // ====================
    // CONVERT PDF
    // ====================

    await convertToPdf({
      // inputPath: `../generated/${clientId}.docx`,
      inputPath: docxPath,
      // buffer: buffer,
      outputPath: pdfPath,
    });

    // ====================
    // UPLOAD
    // ====================

    const result = await uploadPdfToCloudinary(pdfPath);

    // ====================
    // SAVE
    // ====================

    client.guideBookUrl = result.secure_url;

    client.guideBookPublicId = result.public_id;

    await client.save();

    // ====================
    // CLEANUP
    // ====================

    if (fs.existsSync(docxPath)) {
      fs.unlinkSync(docxPath);
    }

    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }

    return result;
  } catch (error) {
    // Cetak error secara detail ke konsol terminal backend
    console.error("❌ Error in generateGuideBook:", error.message);
    console.error(error.stack);

    // ====================
    // CLEANUP (FAIL)
    // ====================
    // Tetap hapus file sementara agar tidak mengotori server jika proses gagal di tengah jalan
    if (fs.existsSync(docxPath)) {
      fs.unlinkSync(docxPath);
      console.log("Cleanup: Temporary DOCX file deleted on error.");
    }
    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
      console.log("Cleanup: Temporary PDF file deleted on error.");
    }

    // Lempar kembali error agar bisa ditangkap oleh Controller API kamu
    throw error;
  }
};

module.exports = generateGuideBook;
