const Room = require("../models/roomModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMonogodbId");


//create room  /api/room/create
const createRoom = asyncHandler(async (req, res) => {


    try {
        const newRoom = await Room.create(req.body);
        res.json(newRoom);
    } catch (error) {
        throw new Error(error);
    }
});

//get all rooms  /api/room
const getaRoom = asyncHandler(async (req, res) => {

    const { id } = req.params;
    validateMongodbId(id);

    try {
        const find = await Room.findById(id);

        if (find) {
            res.json(find);
        } else {
            throw new Error("Room Not Found");
        }
    } catch (error) {
        throw new Error(error);
    }
});

const getAllrooms = asyncHandler(async (req, res) => {
    try {
        const findRoom = await Room.find();
        res.json(findRoom);
    } catch (error) {
        throw new Error(error);
    }
});





// Export the functions
module.exports = { createRoom, getaRoom, getAllrooms};