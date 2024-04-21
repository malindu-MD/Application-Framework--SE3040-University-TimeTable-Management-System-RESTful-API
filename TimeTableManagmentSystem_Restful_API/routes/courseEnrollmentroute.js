const express = require("express");
const {
  courseEnrollment,
  unenrollStudent,
  getEnrolledStudents,
  studentGet,
  getEnrolledStudentsCourse,
} = require("../controller/courseEnrollmentCtrl");
const {
  authMiddleware,
  studentMiddleware,
  adminMiddleware,
  facultyMiddleware,
  adminOrFacultyMiddleware,
} = require("../middlewares/authMiddleware");
const router = express.Router();

// Define the routes

router.post(
  "/:courseId/:studentId",
  authMiddleware,
  studentMiddleware,
  courseEnrollment
);
router.delete(
  "/:courseId/:studentId",
  authMiddleware,
  studentMiddleware,
  unenrollStudent
);
router.get(
  "/:courseId",
  authMiddleware,
  adminOrFacultyMiddleware,
  getEnrolledStudents
);

router.get("/test/:courseId",getEnrolledStudentsCourse);


// Export the router
module.exports = router;
