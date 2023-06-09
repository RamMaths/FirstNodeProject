const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
  name: { 
    //these are the schema type options
    type: String,
    //if we want to specify the error we must put the the boolean option 
    //in an array and the second value is the error string
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name must have less or equal than 40 characters'],
    minlength: [10, 'A tour name must have more or equal than 10 characters']
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a Group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either easy, medium or difficult'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Ratings must be above 1'],
    max: [5, 'Ratings must be below 5']
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(value) {
        return this.price > value;
      },
      message: 'Discount price ({VALUE}) must be below the regular price'
    }
  },
  summary: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  }
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

//DOCUMENT middleware runs before the .save() command and .create()
//but not on insertMany <- this method will not trigger the save middleware
// tourSchema.pre('save', function(next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// tourSchema.pre('save', function(next) {
//   // console.log('Will save document!!');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY middleware
tourSchema.pre(/^find/, function(next) {
  this.find({secretTour: { $ne: true }});
  this.start = Date.now(); //current time in miliseconds
  next();
});

tourSchema.post(/^find/, function(doc, next) {
  console.log(`Query took ${Date.now() - this.start} miliseconds!`);
  next();
});

//AGGREGARION middleware
//the this keyword will point to the aggregation object
tourSchema.pre('aggregate', function(next) {
  console.log(this.pipeline().unshift({  // -> unshift aggregates an element at the beginning of an array, shift aggregates the element at the end
    $match: { secretTour: { $ne: true }}
  })); 
  next();
})

// this is a convention: we always use uppercase on model names 
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
