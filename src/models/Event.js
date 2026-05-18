const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    }, // referensi ke Client yang memiliki event ini

    eventName: {
      type: String,
      required: true,
    }, // nama acara (misalnya: "Akad Nikah", "Resepsi", "Engagement", dll)

    eventType: {
      type: String,
      enum: ["akad", "resepsi", "engagement", "siraman", "lainnya"],
      default: "resepsi",
    }, // jenis acara, dengan opsi terbatas

    eventDate: {
      type: Date,
      required: true,
    }, // tanggal acara

    startTime: String, // jam mulai acara (format: "HH:mm")
    endTime: String, // jam selesai acara (format: "HH:mm")

    venueName: String, // nama tempat acara
    venueAddress: String, // alamat tempat acara

    notes: String, // catatan tambahan tentang acara (misalnya: tema, dress code, dll)

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    }, // status acara, apakah sudah selesai atau masih pending
  },
  {
    timestamps: true,
  },
);

// module.exports = mongoose.model("Event", eventSchema);
const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);
module.exports = Event;
