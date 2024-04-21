const jwt = require("jsonwebtoken");

// Generate Token for User
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Export the function
module.exports = generateToken;
