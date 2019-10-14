import express from 'express';
import { createValidator } from 'express-joi-validation';
import {
  createUserValidator, loginValidator
} from '../config/validators/paramValidators';
import {
  login,
  register,
} from '../controllers/authController';

const validator = createValidator({
  // This options forces validation to pass any errors the express error handler 
  // instead of generating a 400 error
  passError: true
});

const router = express.Router();

// @route   POST api/auth/login
// @desc    Authenticates a user, given a email and password
// @access  public
router.post('/login', validator.body(loginValidator), login);

// @route   POST api/auth/register
// @desc    Register a new user into the system
// @access  public
router.post('/register', validator.body(createUserValidator), register);

export default router;
