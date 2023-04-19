const express = require('express');
const router = express.Router();
const controller = require('../controllers/tourController');

router
  .route('/')
  .get(controller.getAllTours)
  .post(controller.createTour);

router
  .route('/:id')
  .get(controller.getTour)
  .patch(controller.updateTour)
  .delete(controller.deleteTour);

module.exports = router;
