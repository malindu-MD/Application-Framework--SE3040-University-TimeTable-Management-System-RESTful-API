const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Admin", "Faculty", "Student"],
    required: true,
  },
  refreshToken: {
    type: String,
    
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
//password hashing using bcrypt before saving the user to the database
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//password matching using bcrypt for login authentication
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Export the model
module.exports = mongoose.model("User", userSchema);
