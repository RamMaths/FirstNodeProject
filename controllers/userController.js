const mongoose = require('mongoose');
const users = require('../models/userModel');


exports.getAllUsers = async (req, res) => {
  try {
    const user = await users.find(req.body);

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

exports.getUser = async (req, res) => {
  try {
    const user = await users.findById(req.params.id);

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
    const user = await users.create(req.body);

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
    const user = await users.findByIdAndUpdate(req.params.id);

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
    await users.findOneAndDelete(req.params.id);

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
