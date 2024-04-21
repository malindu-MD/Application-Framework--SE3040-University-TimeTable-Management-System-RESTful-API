const generateToken = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMonogodbId");
const generateRefreshToken = require("../config/refreshToken");
const jwt = require("jsonwebtoken");

// Create User   /api/user/register
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    // Create A New User

    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User Already Exist");
  }
});

// Login User   /api/user/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //check if user exists or not

  const findUser = await User.findOne({ email: email });
  if (findUser && (await findUser.matchPassword(password))) {
    const refreshToken = await generateRefreshToken(
      findUser._id,
      findUser.role
    );
    const updateuser = await User.findByIdAndUpdate(
      findUser._id,
      { refreshToken: refreshToken },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

  
    res.json({
      _id: findUser._id,
      firstName: findUser.firstName,
      lastName: findUser.lastName,
      email: findUser.email,
      mobile: findUser.mobile,
      role: findUser.role,
      token: generateToken(findUser._id, findUser.role),
    });
  } else {
    throw new Error("Invalid Email or Password");
  }
});

// Get All User   /api/user
const getallUser = asyncHandler(async (req, res) => {
  try {
    const findUser = await User.find();
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Get A User   /api/user/:id
const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const find = await User.findById(id);

    if (find) {
      res.json(find);
    } else {
      throw new Error("User Not Found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

//delete a user
const deleteaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteUser = await User.findByIdAndDelete(id);

    if (deleteUser) {
      res.json(deleteUser);
    } else {
      throw new Error("User Not Found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

//update a user
const updateaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const updateUser = await User.findByIdAndUpdate(id, req.body);
    res.json(updateUser);
  } catch (error) {
    throw new Error(error);
  }
});

//handle refresh token

const handlerRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;

  if (!cookie.refreshToken) {
    throw new Error("No refresh Token and Please login again");
  }
  const refreshToken = cookie.refreshToken;
  console.log(refreshToken);
  const user = await User.findOne({ refreshToken: refreshToken });
  if (!user) {
    throw new Error("No refresh token or No User Found");
  }
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user._id != decoded.id) {
      throw new Error("There is some thing wrong with refresh token");
    }
    const accessToken = generateToken(user._id, user.role);
    res.json({ accessToken });
  });
});

//logout user

const logoutUser = asyncHandler(async (req, res) => {
  const cookie = req.cookies;

  if (!cookie.refreshToken) {
    throw new Error("No refresh Token in cookies");
  }
  const refreshToken = cookie.refreshToken;
  console.log(refreshToken);
  const user = await User.findOne({ refreshToken: refreshToken });
  if (!user) {
    throw new Error("No refresh token or No User Found");
  } else {
    const updateUser = await User.findByIdAndUpdate(
      user._id,
      { refreshToken: "" },
      { new: true }
    );
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    res.json({ message: "User Logged Out Successfully" });
  }
});


//get all students

const getallStudents = asyncHandler(async (req, res) => {

  try {
    const findUser = await User.find({role:"Student"});
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }

});

//exporting the functions
module.exports = {
  createUser,
  loginUser,
  getallUser,
  getaUser,
  deleteaUser,
  updateaUser,
  handlerRefreshToken,
  logoutUser,
  getallStudents
};
