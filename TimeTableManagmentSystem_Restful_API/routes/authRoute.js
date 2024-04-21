const express = require("express");
const {
  createUser,
  loginUser,
  getallUser,
  getaUser,
  deleteaUser,
  updateaUser,
  handlerRefreshToken,
  logoutUser,
  getallStudents,
} = require("../controller/userCtrl");
const {authMiddleware, adminMiddleware} = require("../middlewares/authMiddleware");
const router = express.Router();

//Routes 
router.post("/register", createUser);   //register a user
router.post("/login", loginUser);       //login a user
router.get("/allusers",authMiddleware,adminMiddleware, getallUser); //get all users
router.get("/user/:id",authMiddleware,getaUser);  //get a user
router.delete("/user/:id", authMiddleware, deleteaUser);  //delete a user
router.put("/user/:id", authMiddleware,  updateaUser);      //update a user
router.get("/refreshtoken",authMiddleware, handlerRefreshToken);  //refresh token
router.get("/logout",authMiddleware,logoutUser); //logout a user
router.get("/getallstundents",authMiddleware,adminMiddleware, getallStudents); //get all students




module.exports = router;
