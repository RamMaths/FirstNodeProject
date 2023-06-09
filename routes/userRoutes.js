const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router
  .route('/')
  .get(controller.getAllUsers)
  .post(controller.createUser);

router
  .route('/:id')
  .get(controller.getUser)
  .patch(controller.updateUser)
  .delete(controller.deleteUser);

module.exports = router;
