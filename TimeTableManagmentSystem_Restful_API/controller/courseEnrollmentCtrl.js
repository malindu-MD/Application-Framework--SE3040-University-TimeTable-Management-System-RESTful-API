const Course = require("../models/courseModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMonogodbId");
const CourseEnrollment = require("../models/courseEnrollmentModel");
const { sendEmail } = require("../service/notificationService");

//function to enroll a student in a course
const courseEnrollment = asyncHandler(async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const studentId = req.params.studentId;
    const course = await Course.findById(courseId);

    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }

    //check if the student is already enrolled in the course

    const isEnrolled = await CourseEnrollment.findOne({
      course: courseId,
      student: studentId,
    });

    if (isEnrolled) {
      res.status(400);
      throw new Error("Student is already enrolled in the course");
    }

    const courseEnrollment = {
      course: courseId,
      student: studentId,
    };

    const newCourseEnrollment = await CourseEnrollment.create(courseEnrollment);
    res.json(newCourseEnrollment);
  } catch (error) {
    throw new Error(error);
  }
});

//function to unenroll a student from a course

const unenrollStudent = asyncHandler(async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const studentId = req.params.studentId;

    const course = await Course.findById(courseId);

    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }

    //check if the student is already enrolled in the course

    const isEnrolled = await CourseEnrollment.findOne({
      course: courseId,
      student: studentId,
    });

    if (!isEnrolled) {
      res.status(400);
      throw new Error("Student is not enrolled in the course");
    }

    await CourseEnrollment.deleteOne({
      course: courseId,
      student: studentId,
    });

    res.json({ message: "Student unenrolled successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

//get all enrolled students in a course

const getEnrolledStudents = asyncHandler(async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId);

    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }

    const enrolledStudents = await CourseEnrollment.find({
      course: courseId,
    }).populate("student");
    const studentsData = enrolledStudents.map(enrollment => enrollment.student);
    res.json(studentsData);
  } catch (error) {
    throw new Error(error);
  }
});


const getEnrolledStudentsCourse = asyncHandler(async (courseID) => {
  try {
    

    const course = await Course.findById(courseID);

    if (!course) {
     return null;
    }

    const enrolledStudents = await CourseEnrollment.find({
      course: courseID,
    }).populate("student");

    const studentsData = enrolledStudents.map(enrollment => enrollment.student);


   return studentsData;
  } catch (error) {
    throw new Error(error);
  }
});


//export the function

module.exports = {
  courseEnrollment,
  unenrollStudent,
  getEnrolledStudents,
  getEnrolledStudentsCourse
}
