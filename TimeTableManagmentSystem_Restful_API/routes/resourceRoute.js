const express = require("express");
const { createResource, getallResource, getaResource } = require("../controller/resourceCtrl");
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();


// Define the routes
router.post("/create", authMiddleware, adminMiddleware, createResource); //create a resource
router.get("/", getallResource); //get all resources
router.get("/:id", getaResource); //get a resource



// Export the router
module.exports = router;