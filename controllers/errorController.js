module.exports = (err, req, res, next) => {
  console.log(err.stack);
  //500 means internal server error and it's usually the standard
  err.statusCode = err.statusCode || 500;
  //500 means error and a 400 means a fail
  err.satus = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
};
