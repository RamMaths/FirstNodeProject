const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: { 
    //these are the schema type options
    type: String,
    //if we want to specify the error we must put the the boolean option 
    //in an array and the second value is the error string
    required: [true, 'A tour must have a name'],
    unique: true
  },
  rating: Number,
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  }
});

// this is a convention: we always use uppercase on model names 
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
