const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  // 400 stands for bad request
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.keyValue.name;
  console.log(value);
  const message = `Duplicate filed value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  //Operational, trusted error: send message to the client

  if(err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

  //Programming or other unknown error: don't leak details to the client
  } else {
    // 1) Log error
    console.log('Error 💥', err);

    // 2) Send a generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
      error: err
    })
  }
};

module.exports = (err, req, res, next) => {
  //500 means internal server error and it's usually the standard
  err.statusCode = err.statusCode || 500;
  //500 means error and a 400 means a fail
  err.status = err.status || 'error';


  console.log(err);
  
  if(process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if(process.env.NODE_ENV === 'production') {
    let error = {...err};
    
    if(error.kind === 'ObjectId') error = handleCastErrorDB(error);
    if(error.code === 11000) error = handleDuplicateFieldsDB(error);

    sendErrorProd(error, res);
  }
};
