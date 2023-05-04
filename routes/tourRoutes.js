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

router
  .route('/top-5-cheap')
  .get(controller.aliasTopTours, controller.getAllTours);

module.exports = router;
