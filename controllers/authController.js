import { UNAUTHORIZED, INTERNAL_SERVER_ERROR } from 'http-status';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import APIError from '../helpers/APIError';
import User from '../models/user';
import { cleanString } from '../utils';

const jwtSecret = 'SUPER_DUPER_SECRET_TOKEN_HERE';

const saveUser = async ({ req, res, next }) => {
  try {
    const user = new User(req.body);
    const createdRec = await user.save();
    // create
    if (res) {
      const createdRecJson = JSON.stringify(createdRec);
      const token = jwt.sign(createdRecJson, jwtSecret);
      const userType = createdRec.userType;
      const message = 'Registration Successful!';
      const data = { jwtAccessToken: `JWT ${token}`, createdRec };

      return res.send({ success: true, message, data });
    }
  } catch (error) {
    next(new APIError(error, INTERNAL_SERVER_ERROR));
  }
};

export const register = async (req, res, next) => {
  try {
    let { email } = req.body;
    email = cleanString(email);
    req.body.email = email;
    const regex = new RegExp(['^', email, '$'].join(''), 'i');
    let foundUser = null;
    foundUser = await User.findOne({ email: { $regex: regex } });
    if (foundUser) return next(new APIError('User already exists', UNAUTHORIZED));

    return saveUser({ req, res, next });
  } catch (error) {
    next(new APIError(error, INTERNAL_SERVER_ERROR));
  }
};