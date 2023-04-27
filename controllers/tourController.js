const fs = require('fs');
const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    //we need a really new object not just the reference
    //that's why we use destructuring

    //Filtering
    const queryObj = {...req.query};
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    //Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    console.log(JSON.parse(queryStr));

    // { difficulty: 'easy', duration: { $gte: '5' } } <- this is what Mongo DB requires
    // { difficulty: 'easy', duration: { gte: '5' } } <- this is how the data comes
    // gte, gt, lte, lt

    const query = Tour.find(JSON.parse(queryStr));
    //Execute query
    const tours = await query;

    res
    .status(200)
    .json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });

  } catch (e) {
    res
    .status(404)
    .json({
      status: 'failed',
      message: e.message
    });
  };
}

exports.getTour = async (req, res) => {
  try {

    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({_id: req.params.id}) -> the findById 
    // would do exactly this behind the scenes

    res
    .status(200)
    .json({
      status: 'success',
      data: {
        tour: tour
      }
    });
  } catch (e) {
    res
    .status(404)
    .json({
      status: 'failed',
      message: e.message
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // const newTour = newTour({});
    // newTour.save();

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour
      }
    });
  } catch (e) {
    res.status(404).json({
      status: 'failed',
      message: {mongoErr: e, errMessage: e.message}
    })
  }
};

exports.updateTour = async (req, res) => {
  try {

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      //this way the new updated document is the one that will
      //be returned  
      new: true,
      //runing again the validator we can avoid problems like
      //when the user inputs a string but it must be a instead
      //of an int
      runValidators: true
    });

    res.status(200).json({
      status: "success",
      data: {
        //tour: tour
        //here could have done this but in ES6 
        //when the property name has the same name as the value
        //you are able to just put the identifier once
        tour
      },
    });
  } catch (e) {
    res.status(404).json({
      status: 'failed',
      message: {mongoErr: e, errMessage: e.message}
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {

    await Tour.findByIdAndDelete(req.params.id);

    res.status(200).json({
    status: "success",
    data: null
    });
  } catch (e) {
    res.status(404).json({
      status: 'failed',
      message: {mongoErr: e, errMessage: e.message}
    });
  }
};

