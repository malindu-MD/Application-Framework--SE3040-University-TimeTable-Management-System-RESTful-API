const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

//middleware to check if the user is authenticated or not
const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
 
  if (req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    console.log(token);
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not authorized, token expired,Please login again");
    }
  } else {
    throw new Error("There is no token attached to the header");
  }
});

//middleware to check if the user is admin or not
const adminMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    throw new Error("Not authorized as an admin");
  }
});

//middleware to check if the user is faculty or not
const facultyMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "Faculty") {
    next();
  } else {
    throw new Error("Not authorized as an faculty member");
  }
});

//middleware to check if the user is student or not
const studentMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "Student") {
    next();
  } else {
    throw new Error("Not authorized as an student member");
  }
});



//middleware to check if the user is admin or faculty
const adminOrFacultyMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  }else if(req.user && req.user.role === "Faculty"){
    next();
  }
  else {
    throw new Error("Not authorized as an admin or faculty member");
  }
});



//time table view middleware

const timeTableViewMiddleware = asyncHandler(async (req, res, next) => {

  const { courseId } = req.params;
  const studentId = req.user._id;


  if (req.user && req.user.role === "Admin") {
    next();
  }else if(req.user && req.user.role === "Faculty"){
    next();
  }
  else {

    

    throw new Error("Not authorized as an admin or faculty member");
  }


});



//export the middleware
module.exports = {
  authMiddleware,
  adminMiddleware,
  facultyMiddleware,
  studentMiddleware,
  adminOrFacultyMiddleware
};
