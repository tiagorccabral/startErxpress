import passportJWT from 'passport-jwt';
// import { jwtSecret } from './app';
import UserSchema from '../models/user';
const ExtractJwt = passportJWT.ExtractJwt;
const jwtStrategy = passportJWT.Strategy;

const jwtSecret = 'SUPER_DUPER_SECRET_TOKEN_HERE';

function passportConfiguration(passport) {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  // opts.tokenQueryParameterName = ExtractJwt.fromUrlQueryParameter(auth_token);
  opts.secretOrKey = jwtSecret;

  passport.use(
    new jwtStrategy(opts, async (jwtPayload, cb) => {
      const user = await UserSchema.findOne({ _id: jwtPayload._doc._id });
      if (!user) return cb('User not found');
      cb(null, user);
    })
  );
}

export default passportConfiguration;
