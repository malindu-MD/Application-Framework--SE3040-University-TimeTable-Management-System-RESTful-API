const mongoose = require("mongoose");

// Define a schema for the course model


const TimeTableSessionSchema = new mongoose.Schema({
  dayOfWeek: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
  startTime: String,
  endTime: String,
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  location:  { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  sessionStatus: { type: String, enum: ['Scheduled', 'Cancelled', 'Postponed'] },
  locationBookID: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  description: String,
});



const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",//refers to the User model
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
  timeTable: [TimeTableSessionSchema]
});

// Create a model from the schema and export it
const Course = mongoose.model("Course", courseSchema);

// Export the model
module.exports = Course;
