const mongoose = require("mongoose");

// Define a schema for the courseEnrollment model

const courseEnrollmentSchema = new mongoose.Schema({


    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },//refers to the Course model
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },//refers to the User model
    entrollmentDate: {
        type: Date,
        default: Date.now,
    },



});


// Create a model from the schema and export it
const CourseEnrollment = mongoose.model("CourseEnrollment", courseEnrollmentSchema);

// Export the model
module.exports = CourseEnrollment;