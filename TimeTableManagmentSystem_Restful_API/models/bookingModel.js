const mongoose = require("mongoose");

// Define a schema for the booking model
const bookingSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  resourceId: { type: mongoose.Schema.Types.ObjectId, ref: "Resource" },
  dayOfWeek: {
    type: String,
    required: true,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  type: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});                

// Create a model from the schema and export it
const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
