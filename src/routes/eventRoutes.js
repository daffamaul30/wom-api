const express = require("express");
const router = express.Router();

const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsByClientId,
} = require("../controllers/eventController");

router.post("/", createEvent);
router.get("/", getAllEvents);
router.get("/client/:clientId", getEventsByClientId);
router.get("/:id", getEventById);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;
