const mongoose = require("mongoose");

//function to validate the mongodb id
const validateMongodbId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error("this id valid or not found in the database");
};





module.exports = validateMongodbId;

