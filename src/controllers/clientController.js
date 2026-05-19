const Client = require("../models/Client");
const Event = require("../models/Event");
const deleteOnCloudinary = require("../service/deleteOnCloudinary");
const generateGuideBook = require("../service/generateGuideBook");

exports.createClient = async (req, res) => {
  try {
    const bride = JSON.parse(req.body.bride);
    const groom = JSON.parse(req.body.groom);

    if (req.uploadedImages?.bridePhoto) {
      bride.photo = req.uploadedImages.bridePhoto.url;
      bride.photoPublicId = req.uploadedImages.bridePhoto.publicId;
    }

    if (req.uploadedImages?.groomPhoto) {
      groom.photo = req.uploadedImages.groomPhoto.url;
      groom.photoPublicId = req.uploadedImages.groomPhoto.publicId;
    }

    const client = await Client.create({
      bride,
      groom,
    });

    res.status(201).json({
      message: "Client berhasil dibuat",
      data: client,
    });
  } catch (error) {
    // rollback gambar bride
    if (req.uploadedImages?.bridePhoto?.publicId) {
      // await cloudinary.uploader.destroy(req.uploadedImages.bridePhoto.publicId);
      await deleteOnCloudinary(req.uploadedImages.bridePhoto.publicId);
    }

    // rollback gambar groom
    if (req.uploadedImages?.groomPhoto?.publicId) {
      // await cloudinary.uploader.destroy(req.uploadedImages.groomPhoto.publicId);
      await deleteOnCloudinary(req.uploadedImages.groomPhoto.publicId);
    }

    res.status(500).json({
      message: "Gagal membuat client",
      error: error.message,
    });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;

    const oldClient = await Client.findById(id);

    if (!oldClient) {
      return res.status(404).json({
        message: "Client tidak ditemukan",
      });
    }

    const updateData = {};

    if (req.body.bride) {
      updateData.bride = {
        ...oldClient.bride.toObject(),
        ...JSON.parse(req.body.bride),
      };
    } else {
      updateData.bride = oldClient.bride.toObject();
    }

    if (req.body.groom) {
      updateData.groom = {
        ...oldClient.groom.toObject(),
        ...JSON.parse(req.body.groom),
      };
    } else {
      updateData.groom = oldClient.groom.toObject();
    }

    if (req.uploadedImages?.bridePhoto) {
      updateData.bride.photo = req.uploadedImages.bridePhoto.url;

      updateData.bride.photoPublicId = req.uploadedImages.bridePhoto.publicId;
    }

    if (req.uploadedImages?.groomPhoto) {
      updateData.groom.photo = req.uploadedImages.groomPhoto.url;

      updateData.groom.photoPublicId = req.uploadedImages.groomPhoto.publicId;
    }

    const updated = await Client.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (req.uploadedImages?.bridePhoto && oldClient?.bride?.photoPublicId) {
      await cloudinary.uploader.destroy(oldClient.bride.photoPublicId);
    }

    if (req.uploadedImages?.groomPhoto && oldClient?.groom?.photoPublicId) {
      await cloudinary.uploader.destroy(oldClient.groom.photoPublicId);
    }

    await generateGuideBook(id);

    res.status(200).json({
      message: "Client berhasil diupdate",
      data: updated,
    });
  } catch (error) {
    if (req.uploadedImages?.bridePhoto?.publicId) {
      await cloudinary.uploader.destroy(req.uploadedImages.bridePhoto.publicId);
    }

    if (req.uploadedImages?.groomPhoto?.publicId) {
      await cloudinary.uploader.destroy(req.uploadedImages.groomPhoto.publicId);
    }

    res.status(500).json({
      message: "Gagal update client",
      error: error.message,
    });
  }
};

exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Berhasil mengambil semua data client",
      total: clients.length,
      data: clients,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data client",
      error: error.message,
    });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({
        message: "Client tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Berhasil mengambil detail client",
      data: client,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil detail client",
      error: error.message,
    });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    // ====================
    // GET CLIENT
    // ====================

    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({
        message: "Client tidak ditemukan",
      });
    }

    // ====================
    // DELETE BRIDE PHOTO
    // ====================

    if (client.bride?.photoPublicId) {
      await deleteOnCloudinary(client.bride.photoPublicId);
    }

    // ====================
    // DELETE GROOM PHOTO
    // ====================

    if (client.groom?.photoPublicId) {
      await deleteOnCloudinary(client.groom.photoPublicId);
    }

    // ====================
    // DELETE GUIDEBOOK
    // ====================

    if (client.guideBookPublicId) {
      await deleteOnCloudinary(client.guideBookPublicId, "raw");
    }

    // ====================
    // DELETE EVENTS
    // ====================

    await Event.deleteMany({
      clientId: id,
    });

    // ====================
    // DELETE CLIENT
    // ====================

    await Client.findByIdAndDelete(id);

    // ====================
    // RESPONSE
    // ====================

    res.json({
      message: "Client dan seluruh data berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal hapus client",
      error: error.message,
    });
  }
};
