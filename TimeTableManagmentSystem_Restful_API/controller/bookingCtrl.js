const Booking = require("../models/bookingModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMonogodbId");



//create booking
const createBooking = asyncHandler(async (req, res) => {
  try {
    const { roomId, resourceId, dayOfWeek, startTime, endTime } = req.body;

    const existingBookingRoom = await checkExistingBooking(
      roomId,
      dayOfWeek,
      startTime,
      endTime
    );
    const existingBookingResource = await checkExistingBookingResourcee(
      resourceId,
      dayOfWeek,
      startTime,
      endTime
    );

    if (existingBookingRoom) {
      return res
        .status(400)
        .json({ error: "Room Location is already booked for this time slot" });
    }

    if (existingBookingResource) {
      return res
        .status(400)
        .json({ error: "This Resource is already booked for this time slot" });
    }

    const newBooking = await Booking.create(req.body);
    res.json(newBooking);
  } catch (error) {
    throw new Error(error);
  }
});

//get a booking  /api/booking/:id

const getaBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const find = await Booking.findById(id);

    if (find) {
      res.json(find);
    } else {
      throw new Error("Booking Not Found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

//get all bookings  /api/booking
const getallBooking = asyncHandler(async (req, res) => {
  try {
    const findBooking = await Booking.find();
    res.json(findBooking);
  } catch (error) {
    throw new Error(error);
  }
});

//update a booking
const updateBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const { roomId, resourceId, dayOfWeek, startTime, endTime, type } =
      req.body;

    // Find the booking to be updated
    const existingBooking = await Booking.findById(id);

    if (!existingBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const existingBookingRoom = await checkExistingBookingRoom(
      id,
      roomId,
      dayOfWeek,
      startTime,
      endTime
    );
    const existingBookingResource = await checkExistingBookingResource(
      id,
      resourceId,
      dayOfWeek,
      startTime,
      endTime
    );

    if (existingBookingRoom) {
      return res
        .status(400)
        .json({ error: "Room is already booked for this time slot" });
    }

    if (existingBookingResource) {
      return res
        .status(400)
        .json({ error: "Resource is already booked for this time slot" });
    }

    // If no overlap, update the booking
    existingBooking.roomId = roomId;
    existingBooking.resourceId = resourceId;
    existingBooking.dayOfWeek = dayOfWeek;
    existingBooking.startTime = startTime;
    existingBooking.endTime = endTime;
    existingBooking.type = type;
    await existingBooking.save();

    res.json(existingBooking);
  } catch (error) {
    throw new Error(error);
  }
});

//delete a booking
const deleteBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteBooking = await Booking.findByIdAndDelete(id);

    if (deleteBooking) {
      res.json(deleteBooking);
    } else {
      throw new Error("Booking Not Found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Check if there are any existing bookings for the same resource and overlapping time slot
const checkExistingBookingResource = async (
  id,
  resourceId,
  dayOfWeek,
  startTime,
  endTime
) => {
  return await Booking.findOne({
    _id: { $ne: id }, // Exclude the current booking being updated
    resourceId,
    dayOfWeek,
    $or: [
      {
        $and: [
          { startTime: { $lt: endTime } },  // Existing booking starts before new booking ends
          { endTime: { $gt: startTime } }   // Existing booking ends after new booking starts
        ]
      },
      {
        $and: [
          { startTime: { $gte: startTime } }, // Existing booking starts after or at the same time as new booking
          { endTime: { $lte: endTime } }      // Existing booking ends before or at the same time as new booking
        ]
      }
    ]
  });
};

// Check if there are any existing bookings for the same room and overlapping time slot
const checkExistingBookingRoom = async (
  id,
  roomId,
  dayOfWeek,
  startTime,
  endTime
) => {
  return await Booking.findOne({
    _id: { $ne: id }, // Exclude the current booking being updated
    roomId,
    dayOfWeek,
    $or: [
      {
        $and: [
          { startTime: { $lt: endTime } },  // Existing booking starts before new booking ends
          { endTime: { $gt: startTime } }   // Existing booking ends after new booking starts
        ]
      },
      {
        $and: [
          { startTime: { $gte: startTime } }, // Existing booking starts after or at the same time as new booking
          { endTime: { $lte: endTime } }      // Existing booking ends before or at the same time as new booking
        ]
      }
    ]
  });
};

// Check if there are any existing bookings for the same room and overlapping time slot
const checkExistingBooking = async (roomId, dayOfWeek, startTime, endTime) => {
  try {
    // Find a booking that matches the provided parameters
    const existingBooking = await Booking.findOne({
      roomId,
      dayOfWeek,
      $or: [
        {
          $and: [
            { startTime: { $lt: endTime } },  // Existing booking starts before new booking ends
            { endTime: { $gt: startTime } }   // Existing booking ends after new booking starts
          ]
        },
        {
          $and: [
            { startTime: { $gte: startTime } }, // Existing booking starts after or at the same time as new booking
            { endTime: { $lte: endTime } }      // Existing booking ends before or at the same time as new booking
          ]
        }
      ]
    });

    return existingBooking; // Return the existing booking (if found)
  } catch (error) {
    console.error("Error checking existing booking:", error);
    throw error;
  }
};



const checkExistingBookingResourcee = async (resourceId, dayOfWeek, startTime, endTime) => {
  try {
    // Find a booking that matches the provided parameters
    const existingBooking = await Booking.findOne({
      resourceId,
      dayOfWeek,
      $or: [
        {
          $and: [
            { startTime: { $lt: endTime } },  // Existing booking starts before new booking ends
            { endTime: { $gt: startTime } }   // Existing booking ends after new booking starts
          ]
        },
        {
          $and: [
            { startTime: { $gte: startTime } }, // Existing booking starts after or at the same time as new booking
            { endTime: { $lte: endTime } }      // Existing booking ends before or at the same time as new booking
          ]
        }
      ]
    });

    return existingBooking; // Return the existing booking (if found)
  } catch (error) {
    console.error("Error checking existing booking:", error);
    throw error;
  }
};


// what time can we get a meeting for discussion

module.exports = {
  createBooking,
  getaBooking,
  getallBooking,
  updateBooking,
  deleteBooking,
  checkExistingBookingResource,
  checkExistingBookingRoom,
  checkExistingBooking,
};
