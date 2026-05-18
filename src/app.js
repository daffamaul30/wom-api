const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const clientRoutes = require("../src/routes/clientRoutes");
const eventRoutes = require("../src/routes/eventRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/clients", clientRoutes);
app.use("/api/events", eventRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Wedding Organizer Management" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
