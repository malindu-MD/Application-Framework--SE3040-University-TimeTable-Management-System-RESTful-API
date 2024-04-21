const express = require("express");
const {
  createCourse,
  getaCourse,
  getallCourse,
  updateaCourse,
  deleteaCourse,
  assignFacultyToCourse,
  getallCourseByFacultyId,
} = require("../controller/courseCtrl");
const router = express.Router();
const {
  authMiddleware,
  adminMiddleware,
  adminOrFacultyMiddleware,
} = require("../middlewares/authMiddleware");

//Routes for course
router.post("/create", authMiddleware, adminMiddleware, createCourse);
router.get("/:id", getaCourse);
router.get("/", getallCourse);
router.put("/:id", authMiddleware, adminMiddleware, updateaCourse);
router.delete("/:id", authMiddleware, adminMiddleware, deleteaCourse);
router.put("/course/:courseId",authMiddleware,adminMiddleware,assignFacultyToCourse);
router.get("/faculty/:facultyId",authMiddleware,adminOrFacultyMiddleware,getallCourseByFacultyId);

//exporting the router
module.exports = router;
