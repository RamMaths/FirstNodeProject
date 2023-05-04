const Tour = require('./../models/tourModel');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    //we need a really new object not just the reference
    //that's why we use destructuring

    // 1A) Filtering
    const queryObj = {...req.query};
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    // { difficulty: 'easy', duration: { $gte: '5' } } <- this is what Mongo DB requires
    // { difficulty: 'easy', duration: { gte: '5' } } <- this is how the data comes
    // gte, gt, lte, lt

    let query = Tour.find(JSON.parse(queryStr));

    // 2) Sorting
    if(req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);

      // sort('price ratingsAvergage') this is what Mongo DB needs
      // sort('price,ratingsAvergage') since we cannot leave spaces in the url
      // we put comma instead
    } else {
      query = query.sort('-createdAt');
    }

    // 3) Field limiting
    if(req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      // query = query.select('name duration difficulty') <- this is what we need to pass just one single string
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 4) Pagination

    //user wants page number two with 10 result per page 1-10 page1, 11 - 20 page2...
    //page=2&limit=10
    //so we want to skip 10 results before we start querying
    // query = query.skip(10).limit(10);

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if(req.query.page) {
      const numTours = await Tour.countDocuments();
      if(numTours / limit < page) throw new Error('This page does not exist');
    }

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

