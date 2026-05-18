const express = require("express");
const router = express.Router();

const {
  createClient,
  updateClient,
  deleteClient,
  getAllClients,
  getClientById,
} = require("../controllers/clientController");

const uploadClientImages = require("../middleware/uploadClientImages");

router.post("/", uploadClientImages, createClient);
router.get("/", getAllClients);
router.get("/:id", getClientById);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

module.exports = router;
