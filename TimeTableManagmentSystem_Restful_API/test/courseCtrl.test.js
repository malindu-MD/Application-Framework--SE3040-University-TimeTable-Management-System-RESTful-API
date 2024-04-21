const {
  createCourse,
  getalltheCourse,
  updateaCourse,
  getOneCourse,
  deleteaCourse,
  assignFacultyToCourse,
} = require("../controller/courseCtrl");
const Course = require("../models/courseModel");
const asyncHandler = require("express-async-handler");

jest.mock("../models/courseModel");

describe("Course Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("add new Course ", () => {
    it("should create a new course", async () => {
      const mockCourseData = {
        name: "Sample Course",
        code: "CS101",
        description: "This is a sample course for testing purposes",
        credits: 3,
      };

      const req = { body: { mockCourseData } };
      const res = { json: jest.fn() };

      Course.create.mockResolvedValue(req.body);
      await createCourse(req, res);

      expect(Course.create).toHaveBeenCalledWith(req.body);

      expect(res.json).toHaveBeenCalledWith(req.body);
    });
  });

  describe("get a Course", () => {
    it("should get a course by id", async () => {
      const mockCourse = {
        name: "Sample Course",
        code: "CS101",
        description: "This is a sample course for testing purposes",
        credits: 3,
      };

      const req = { params: { id: "65fc0709ee833a7a362e768e" } };
      const res = { json: jest.fn() };

      Course.findById.mockResolvedValue(mockCourse);

      await getOneCourse(req, res);

      expect(Course.findById).toHaveBeenCalledWith(req.params.id);
      expect(res.json).toHaveBeenCalledWith(mockCourse);
    });
  });

  describe("get all Courses", () => {
    it("should get all courses", async () => {
      const mockCourses = [
        {
          name: "Sample Course 1",
          code: "CS101",
          description: "This is a sample course for testing purposes",
          credits: 3,
        },
        {
          name: "Sample Course 2",
          code: "CS102",
          description: "This is a sample course for testing purposes",
          credits: 3,
        },
      ];

      const req = {};
      const res = { json: jest.fn() };

      Course.find.mockResolvedValue(mockCourses);

      await getalltheCourse(req, res);

      expect(Course.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockCourses);
    });
  });

  describe("update a Course", () => {
    it("should update a course by id", async () => {
      const mockCourse = {
        name: "Sample Course",
        code: "CS101",
        description: "This is a sample course for testing purposes",
        credits: 3,
      };

      const req = {
        params: { id: "65fc0709ee833a7a362e768e" },
        body: { name: "Updated Course" },
      };
      const res = { json: jest.fn() };

      Course.findByIdAndUpdate.mockResolvedValue(mockCourse);

      await updateaCourse(req, res);

      expect(Course.findByIdAndUpdate).toHaveBeenCalledWith(
        req.params.id,
        req.body,
        { new: true }
      );
      expect(res.json).toHaveBeenCalledWith(mockCourse);
    });
  });

  //assign faculty to course

  // describe("delete a Course", () => {
  //   it("should delete a course by id", async () => {
  //     const req = { params: { id: "65fc0709ee833a7a362e768e" } };
  //     const res = { json: jest.fn() };

  //     await deleteaCourse(req, res);

  //     expect(Course.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
  //     expect(res.json).toHaveBeenCalled();
  //   });
  // });

  // Write similar test cases for other controller functions (getaCourse, getallCourse, updateaCourse, deleteaCourse, assignFacultyToCourse)
});
