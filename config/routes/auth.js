import express from 'express';
import { createValidator } from 'express-joi-validation';
import {
  createUserValidator,
} from '../validators/paramValidators';
import {
  // login,
  register,
} from '../../controllers/authController';

const validator = createValidator();

const router = express.Router();

// router.route('/login').post(validate(loginParam), login);
router.post('/register', validator.params(createUserValidator), register);

export default router;