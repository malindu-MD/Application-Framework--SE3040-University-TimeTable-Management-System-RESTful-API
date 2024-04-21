const mongoose=require('mongoose');



// Define a schema for the resource model
const resourceSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true
       
    },
    itemCode: {
        type: String,
        required: true,
        unique: true,
    },



});



// Create a model from the schema and export it
const Resource = mongoose.model("Resource", resourceSchema);

module.exports = Resource;