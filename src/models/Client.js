const mongoose = require("mongoose");

const siblingSchema = new mongoose.Schema(
  {
    name: String, // nama saudara kandung
    phone: String, // nomor telepon saudara kandung
    relation: String, // hubungan dengan pengantin (misalnya: "Kakak" atau "Adik")
    maritalStatus: String, // status pernikahan saudara
    spouseStatus: String, // Istri atau Suami
    spouseName: String, // nama pasangan saudara
    spousePhone: String, // nomor telepon pasangan saudara
  },
  { _id: false },
);

const clientSchema = new mongoose.Schema(
  {
    bride: {
      fullName: { type: String, required: true }, // nama lengkap pengantin wanita
      phone: String, // nomor telepon pengantin wanita
      nickname: String, // nama panggilan pengantin wanita

      photo: String, // foto pengantin wanita

      childNumber: Number, // urutan anak dalam keluarga
      siblingsTotal: Number, // total saudara kandung

      father: {
        name: String, // nama ayah pengantin wanita
        phone: String, // nomor telepon ayah pengantin wanita
      },

      mother: {
        name: String, // nama ibu pengantin wanita
        phone: String, // nomor telepon ibu pengantin wanita
      },

      siblings: [siblingSchema], // array saudara kandung pengantin wanita
    },

    groom: {
      fullName: { type: String, required: true }, // nama lengkap pengantin pria
      phone: String, // nomor telepon pengantin pria
      nickname: String, // nama panggilan pengantin pria

      photo: String, // foto pengantin pria

      childNumber: Number, // urutan anak dalam keluarga
      siblingsTotal: Number, // total saudara kandung

      father: {
        name: String, // nama ayah pengantin pria
        phone: String, // nomor telepon ayah pengantin pria
      },

      mother: {
        name: String, // nama ibu pengantin pria
        phone: String, // nomor telepon ibu pengantin pria
      },

      siblings: [siblingSchema], // array saudara kandung pengantin pria
    },

    guideBookUrl: {
      type: String,
    },

    guideBookPublicId: {
      type: String,
    },
  },
  { timestamps: true }, // otomatis menambahkan createdAt dan updatedAt
);

// module.exports = mongoose.model("Client", clientSchema);
const Client = mongoose.models.Client || mongoose.model("Client", clientSchema);
module.exports = Client;
