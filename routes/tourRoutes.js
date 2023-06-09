const express = require('express');
const router = express.Router();
const controller = require('../controllers/tourController');
const authController = require('../controllers/authController');

router
  .route('/')
  .get(authController.protect, controller.getAllTours)
  .post(controller.createTour);

router
  .route('/tour-stats')
  .get(controller.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(controller.getMonthlyPlan);

router
  .route('/top-5-cheap/')
  .get(controller.aliasTopTours, controller.getAllTours);

router
  .route('/:id')
  .get(controller.getTour)
  .patch(controller.updateTour)
  .delete(controller.deleteTour);

module.exports = router;
