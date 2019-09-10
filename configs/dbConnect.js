const mongoose = require('mongoose');
const mongoDB = require('./key').MongoURL;

module.exports = {
  databaseConnection: function() {
    mongoose
      .connect(mongoDB, {
        useNewUrlParser: true,
        useCreateIndex: true
      })
      .then(() => console.log('Connected to MongoDB...'))
      .catch(err => console.error('Could not connect to MongoDB...', err.message));
  },
  createLocalConnection: mongoose.createConnection(mongoDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
};
