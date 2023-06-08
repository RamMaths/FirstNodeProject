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
      message: 'Something went very wrong!'
    })
  }
};


module.exports = (err, req, res, next) => {
  //500 means internal server error and it's usually the standard
  err.statusCode = err.statusCode || 500;
  //500 means error and a 400 means a fail
  err.status = err.status || 'error';

  if(process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if(process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res);
  }
};
