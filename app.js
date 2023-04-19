const express = require('express');
const morgan = require('morgan');
const app = express();
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//1. MIDDLEWARES
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// in each middle ware function we have access to the request and the response
// objects but we also have the "next" function and like this node js knows that we are 
// defining a middleware function

// we need to call the next function, if we didn't call the next function, then the request and response cycle
// would really be stucked at this point and we would never ever send back a response
//
// this middlware applies to each and every single request and that's beacuse we didn't specify any route
//
// by sending the response we actually end the request response cycle
app.use((req, res, next) => {
  console.log('Hello from the middlware 👋🏼');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//mounting the routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
