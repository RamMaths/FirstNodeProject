const fs = require('fs');

const Tour = require('./../models/tourModel');

exports.getAllTours = (req, res) => {
  res
    .status(200)
    .json({
      status: 'success',
      requestedAt: req.requestTime,
      // results: tours.length,
      // data: {
      //   tours
      // }
    });
};

exports.getTour = (req, res) => {
  res
    .status(200)
    .json({
      status: 'success',
      // data: {
      //   tour: tour
      // }
    });
};

exports.createTour = async (req, res) => {
  try {
    console.log(req.body);
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour
      }
    });
  } catch (e) {
    res.status(400).json({
      status: 'failed',
      message: {mongoErr: e, errMessage: e.message}
    })
  }
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: '<Updated tour here...'
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: null
    });
};

