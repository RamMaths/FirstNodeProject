const express = require('express');
const router = express.Router();
const controller = require('../controllers/tourController');

router
  .route('/')
  .get(controller.getAllTours)
  .post(controller.createTour);

router
  .route('/tour-stats')
  .get(controller.getTourStats);

router
  .route('/top-5-cheap/')
  .get(controller.aliasTopTours, controller.getAllTours);

router
  .route('/:id')
  .get(controller.getTour)
  .patch(controller.updateTour)
  .delete(controller.deleteTour);

module.exports = router;
