const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');


const serverlessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name must be exist!']
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    minlength: [7, 'should be grater than 7 character'],
    required: [true, 'Password must required!']
  }
});

serverlessSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcryptjs.hash(this.password, 12);
  next();
});

serverlessSchema.methods.passwordCompare = async function (candidatePassword, password) {
  return await bcryptjs.compare(candidatePassword, password);
}


const Serverless = mongoose.model('Serverless', serverlessSchema);
module.exports = Serverless;