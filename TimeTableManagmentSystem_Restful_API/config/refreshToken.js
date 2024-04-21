const jwt = require("jsonwebtoken");

// Generate Refresh Token for User
const generateRefreshToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

// Export the function
module.exports = generateRefreshToken;
