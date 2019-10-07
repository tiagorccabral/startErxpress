import bcrypt from 'bcrypt';
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  userType: { type: String, default: 'regular' },
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  email: { type: String, unique: true },
  // password: { type: String, select: false },
  password: { type: String },
  active: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
});

/**
 * converts the string value of the password to some hashed value
 * - pre-save hooks
 * - validations
 * - virtuals
 */
// eslint-disable-next-line
UserSchema.pre('save', function userSchemaPre(next) {
  const user = this;
  if (!user.password || (!this.isModified('password') && !this.isNew)) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (hashErr, hash) => {
      if (hashErr) return next(hashErr);

      user.password = hash;
      next();
    });
  });
});

/**
 * comapare the stored hashed value of the password with the given value of the password
 * @param pw - password whose value has to be compare
 * @param cb - callback function
 */
UserSchema.methods.comparePassword = function comparePassword(pw, cb) {
  const that = this;
  // eslint-disable-next-line
  bcrypt.compare(pw, that.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};


 /**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .execAsync()
      .then(user => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },
  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 20 } = {}) {
    return this.find({ $or: [{ userType: 'rider' }, { userType: 'driver' }] })
      .sort({ _id: -1 })
      .select('-__v')
      .skip(skip)
      .limit(limit)
      .execAsync();
  },
};
/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
