const mongoose = require('mongoose');

const serverlessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name must be exist!']
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
});

const Serverless = mongoose.model('Serverless', serverlessSchema);
module.exports = Serverless;