import Promise from 'bluebird';
import mongoose from 'mongoose';
import express from 'express';

// promisify mongoose
Promise.promisifyAll(mongoose);
const options = {
  reconnectInterval: 500,
  bufferMaxEntries: 0,
  socketTimeoutMS: 0,
  keepAlive: true,
  reconnectTries: 30,
  useNewUrlParser: true,
  useCreateIndex: true,
  poolSize: 50,
  autoIndex: false,
};

const app = express();

const port = process.env.PORT || 5000;
const host = 'mongodb://localhost/starterXpress-development';

const listen = () =>
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

if (process.env.NODE_ENV === 'test') {
  mongoose.connect(
    host,
    options,
    async () => {
      /* Drop the DB */
      mongoose.connection.once('open', () => {
        mongoose.connection.db.dropDatabase();
        return listen();
      });
    }
  );
} else {
  // env !== 'test'
  mongoose.connect(
    host,
    options
  );
}
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${host}`);
});

listen();