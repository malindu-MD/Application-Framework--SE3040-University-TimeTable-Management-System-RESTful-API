const Course = require("../models/courseModel");

const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMonogodbId");
const {
  checkExistingBookingRoom,
  checkExistingBooking,
} = require("./bookingCtrl");
const Booking = require("../models/bookingModel");
const { getEnrolledStudents, getEnrolledStudentsCourse } = require("./courseEnrollmentCtrl");
const CourseEnrollment = require("../models/courseEnrollmentModel");
const { sendNotificationToAllEnrolledStudents } = require("../service/notificationService");

//add new session to course time table

const addSessionToCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params; //courseId is the id of the course

  try {
    const {
      location,
      sessionStatus,
      description,
      dayOfWeek,
      startTime,
      endTime,
      faculty,
    } = req.body;

    const course = await Course.findById(courseId); //find the course by id
    if (!course) {
      //if course is not found
      return res.status(404).json({ error: "Course Not Found" });
    }

    //check if the room is already booked for this time slot (roomId, dayOfWeek, startTime, endTime)
    const existingBookingRoom = await checkExistingBooking(
      location,
      dayOfWeek,
      startTime,
      endTime
    );

    if (existingBookingRoom) {
      //if room is already booked
      return res
        .status(400)
        .json({ error: "Room Location is already booked for this time slot" });
    }

    //create a new booking for the room
    const newBook = {
      dayOfWeek: dayOfWeek,
      startTime: startTime,
      endTime: endTime,
      roomId: location,
      type: "class",
    };

    const newBooking = await Booking.create(newBook); //create a new booking for the room

    //create a new session for the course
    const newSession = {
      dayOfWeek: dayOfWeek,
      startTime: startTime,
      endTime: endTime,
      faculty: faculty,
      location: location,
      sessionStatus: sessionStatus,
      locationBookID: newBooking._id,
      description: description,
    };

    course.timeTable.push(newSession); //add the new session to the course time table
    await course.save(); //save the course
   


   

    const enrolledStudents = await CourseEnrollment.find({
      course: courseId,
    }).populate("student");

    const studentsData = enrolledStudents.map(enrollment => enrollment.student.email);
    
    console.log(studentsData);

   await sendNotificationToAllEnrolledStudents(course.code,studentsData,"Time Table Notification","New Session Added to the Course");

   

    res.json(course.timeTable); //return the course time table
  } catch (error) {
    throw new Error(error); //throw an error
  }
});

//update a session in the course time table

const updateSessionInCourse = asyncHandler(async (req, res) => {
  try {
    const { courseId, sessionId } = req.params; //courseId is the id of the course and sessionId is the id of the session
    const {
      location,
      sessionStatus,
      description,
      dayOfWeek,
      startTime,
      endTime,
      faculty,
    } = req.body;

    const course = await Course.findById(courseId); //find the course by id

    if (!course) {
      //if course is not found
      return res.status(404).json({ error: "Course Not Found" });
    }

    const session = course.timeTable.id(sessionId); //find the session by id

    if (!session) {
      //if session is not found
      return res.status(404).json({ error: "Session Not Found" });
    }

    //check if the room is already booked for this time slot (roomId, dayOfWeek, startTime, endTime)
    const existingBookingRoom = await checkExistingBookingRoom(
      session.locationBookID,
      location,
      dayOfWeek,
      startTime,
      endTime
    );

    if (existingBookingRoom) {
      //if room is already booked
      return res
        .status(400)
        .json({ error: "Room Location is already booked for this time slot" });
    }

    //update the booking for the room

    const booking = await Booking.findById(session.locationBookID); //find the booking by id

    booking.dayOfWeek = dayOfWeek;
    booking.startTime = startTime;
    booking.endTime = endTime;
    booking.roomId = location;
    booking.type = "class";
    await booking.save(); //save the booking

    //update the session

    session.dayOfWeek = dayOfWeek;
    session.startTime = startTime;
    session.endTime = endTime;
    session.faculty = faculty;
    session.location = location;
    session.sessionStatus = sessionStatus;
    session.description = description;

    await course.save(); //save the course

    const enrolledStudents = await CourseEnrollment.find({
      course: courseId,
    }).populate("student");
      
    const studentsData = enrolledStudents.map(enrollment => enrollment.student.email);
    
    console.log(studentsData);
    
    await sendNotificationToAllEnrolledStudents(course.code,studentsData,"Time Table Notification","Session was updated in the Course");
     
    
    res.json(course.timeTable); //return the course time table
  } catch (error) {
    throw new Error(error); //throw an error
  }
});

//delete a session in the course time table

const deleteSessionInCourse = asyncHandler(async (req, res) => {
  try {
    const { courseId, sessionId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course Not Found" });
    }

    const sessionIndex = course.timeTable.findIndex(
      (session) => session._id.toString() === sessionId
    );
    if (sessionIndex === -1) {
      return res.status(404).json({ error: "Session Not Found" });
    }

    const session = course.timeTable[sessionIndex];

    // Delete the booking associated with the session
    const booking = await Booking.findByIdAndDelete(session.locationBookID);

    // Remove the session from the timeTable array
    course.timeTable.splice(sessionIndex, 1);

    await course.save();
    
    const enrolledStudents = await CourseEnrollment.find({
      course: courseId,
    }).populate("student");
      
    const studentsData = enrolledStudents.map(enrollment => enrollment.student.email);
    
    console.log(studentsData);
    
    await sendNotificationToAllEnrolledStudents(course.code,studentsData,"Time Table Notification","Session was removed in the Course");

    res.json(course.timeTable);
  } catch (error) {
    throw new Error(error);
  }
});

//get all sessions in the course time table

const getAllSessionsInCourse = asyncHandler(async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course Not Found" });
    }

    res.json(course.timeTable);
  } catch (error) {
    throw new Error(error);
  }
});


const studentEntrolledInCourse = asyncHandler(async (courseID) => {
  try {
    

    const course = await Course.findById(courseID);

    if (!course) {
     return null;
    }

    const enrolledStudents = await CourseEnrollment.find({
      course: courseID,
    }).populate("student");

   res.json(enrolledStudents);
  } catch (error) {
    throw new Error(error);
  }
});

// Export the moduleS
module.exports = {
  addSessionToCourse,
  updateSessionInCourse,
  deleteSessionInCourse,
  getAllSessionsInCourse,
  studentEntrolledInCourse
};
