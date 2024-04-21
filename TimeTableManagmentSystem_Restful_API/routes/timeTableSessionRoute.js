const express = require("express");
const {
  addSessionToCourse,
  updateSessionInCourse,
  deleteSessionInCourse,
  getAllSessionsInCourse,
} = require("../controller/timeTableSessionCtrl");
const {
  authMiddleware,
  adminOrFacultyMiddleware,
} = require("../middlewares/authMiddleware");
const { getEnrolledStudents } = require("../controller/courseEnrollmentCtrl");
const router = express.Router();


// Routes
router.post(
  "/create/:courseId",
  authMiddleware,
  adminOrFacultyMiddleware,
  addSessionToCourse
);
router.put(
  "/update/:courseId/:sessionId",
  authMiddleware,
  adminOrFacultyMiddleware,
  updateSessionInCourse
);
router.delete(
  "/delete/:courseId/:sessionId",
  authMiddleware,
  adminOrFacultyMiddleware,
  deleteSessionInCourse
);
router.get("/all/:courseId", getAllSessionsInCourse);


module.exports = router;
