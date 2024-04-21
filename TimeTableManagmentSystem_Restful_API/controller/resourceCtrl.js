const Resource = require('../models/resourceModel');
const asyncHandler = require("express-async-handler");



//get a resource  /api/resource/:id
const createResource = asyncHandler(async (req, res) => {

    try {
        const newResource = await Resource.create(req.body);
        res.json(newResource);
    } catch (error) {
        throw new Error(error);
    }


});


//get a resource  /api/resource/:id

const getaResource = asyncHandler(async (req, res) => {

    const { id } = req.params;
    try {
        const find = await Resource.findById(id);

        if (find) {
            res.json(find);
        } else {
            throw new Error("Resource Not Found");
        }
    } catch (error) {
        throw new Error(error);
    }

});



//get all resources  /api/resource


const getallResource = asyncHandler(async (req, res) => {

    try {
        const findResource = await Resource.find();
        res.json(findResource);
    } catch (error) {
        throw new Error(error);
    }

});



module.exports = { createResource, getaResource, getallResource };