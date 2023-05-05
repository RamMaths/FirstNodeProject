const Tour = require('./../models/tourModel');
const APIFeatures = require('../utils/apifeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {

    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

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
    console.log(e);
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

