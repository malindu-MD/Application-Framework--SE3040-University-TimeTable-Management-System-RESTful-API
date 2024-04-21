const express = require("express");
const { createRoom, getAllrooms, getaRoom } = require("../controller/roomCtrl");
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

// Define the routes
router.post("/create", authMiddleware, adminMiddleware, createRoom); //create a room location 
router.get("/", getAllrooms);  //get all room locations
router.get("/:id", getaRoom);  //get a room location



// Export the router
module.exports = router;


