const Event = require("../models/Event");
const generateGuideBook = require("../service/generateGuideBook");

exports.createEvent = async (req, res) => {
  try {
    const data =
      typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body;

    const event = await Event.create(data);

    await generateGuideBook(event.clientId);

    res.status(201).json({
      message: "Event berhasil dibuat",
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal membuat event",
      error: error.message,
    });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("clientId")
      .sort({ eventDate: 1 });

    res.status(200).json({
      message: "Berhasil mengambil semua event",
      total: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data event",
      error: error.message,
    });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id).populate("clientId");

    if (!event) {
      return res.status(404).json({
        message: "Event tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Berhasil mengambil detail event",
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil detail event",
      error: error.message,
    });
  }
};

exports.getEventsByClientId = async (req, res) => {
  try {
    const { clientId } = req.params;

    const events = await Event.find({
      clientId: clientId,
    })
      .populate("clientId")
      .sort({ eventDate: 1 });

    res.status(200).json({
      message: "Berhasil mengambil event berdasarkan client",
      total: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil event client",
      error: error.message,
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const data =
      typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body;

    const event = await Event.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({
        message: "Event tidak ditemukan",
      });
    }

    await generateGuideBook(event.clientId);

    res.status(200).json({
      message: "Event berhasil diupdate",
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal update event",
      error: error.message,
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({
        message: "Event tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Event berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus event",
      error: error.message,
    });
  }
};
