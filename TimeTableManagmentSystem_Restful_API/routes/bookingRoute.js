const express = require("express");
const {
  createBooking,
  getallBooking,
  getaBooking,
  updateBooking,
  deleteBooking,
} = require("../controller/bookingCtrl");
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

// Define the routes

router.post("/create",authMiddleware,adminMiddleware, createBooking);

router.get("/", authMiddleware,adminMiddleware,getallBooking);
router.get("/:id",authMiddleware,adminMiddleware, getaBooking);
router.put("/:id",authMiddleware,adminMiddleware, updateBooking);
router.delete("/:id",authMiddleware,adminMiddleware, deleteBooking);

// Export the router

module.exports = router;
