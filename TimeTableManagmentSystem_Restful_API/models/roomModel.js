const mongoose = require("mongoose");

// Define a schema for the room model
const roomSchema = new mongoose.Schema({
  roomName: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
});

// Create a model from the schema and export it
const Room = mongoose.model("Room", roomSchema);

// Export the model
module.exports = Room;
