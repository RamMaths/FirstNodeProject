const mongoose = require('mongoose');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res
  .status(200)
  .json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });

});

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch(err) {
    // 500 code means internal error(server error)
    res.status(404).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch(err) {
    // 500 code means internal error(server error)
    res.status(404).json({
      status: 'error',
      message: 'failed'
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch(err) {
    // 500 code means internal error(server error)
    res.status(404).json({
      status: 'error',
      message: 'failed'
    });
  }
}

exports.deleteUser = async (req, res) => {
  try {
    await User.findOneAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        user: null
      }
    });
  } catch(err) {
    // 500 code means internal error(server error)
    res.status(404).json({
      status: 'error',
      message: 'failed'
    });
  }
}
