const Course = require("../models/courseModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMonogodbId");

// Create Course   /api/course/create

const createCourse = asyncHandler(async (req, res) => {
  try {
   
    //check if course exists or not
    
    const {code}=req.body;
    const findCourse = await Course.findOne({ code: code });
    if (findCourse) {
      throw new Error("Course Already Exist");
    }


    const newCourse = await Course.create(req.body);
    res.json(newCourse);
  } catch (error) {
    throw new Error(error);
  }
});

//get a course  /api/course/:id

const getaCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const find = await Course.findById(id).select("-timeTable");

    if (find) {
      res.json(find);
    } else {
      throw new Error("Course Not Found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

const getOneCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const find = await Course.findById(id);

    if (find) {
      res.json(find);
    } else {
      throw new Error("Course Not Found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

//get all courses  /api/course

const getallCourse = asyncHandler(async (req, res) => {
  try {
    const findCourse = await Course.find().select("-timeTable");
    res.json(findCourse);
  } catch (error) {
    throw new Error(error);
  }
});

const getalltheCourse = asyncHandler(async (req, res) => {
  try {
    const findCourse = await Course.find();
    res.json(findCourse);
  } catch (error) {
    throw new Error(error);
  }
});

//update a course

const updateaCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const updateCourse = await Course.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateCourse);
  } catch (error) {
    throw new Error(error);
  }
});

//delete a course

const deleteaCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteCourse = await Course.findByIdAndDelete(id);

    if (deleteCourse) {
      res.json(deleteCourse);
    } else {
      throw new Error("Course Not Found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Assign faculty to the course  /api/course/:courseId/assign-faculty
const assignFacultyToCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { facultyId } = req.body;
  validateMongodbId(courseId);
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    // Assign faculty to the course
    course.faculty = facultyId;
    await course.save();

    res.json(course);
  } catch (error) {
    throw new Error(error);
  }
});

//get all course by faculty id

const getallCourseByFacultyId = asyncHandler(async (req, res) => {

  const { facultyId } = req.params;
  validateMongodbId(facultyId);
  try {
    const findCourse = await Course.find({ faculty: facultyId });
    res.json(findCourse);
  } catch (error) {
    throw new Error(error);
  }
}
);

module.exports = {
  createCourse,
  getaCourse,
  getallCourse,
  getOneCourse,
  updateaCourse,
  deleteaCourse,
  assignFacultyToCourse,
  getalltheCourse,
  getallCourseByFacultyId
};
// export all the functions
