const Serverless = require('./Model');
const jwt = require('jsonwebtoken');

const getToken = async (userID) => {
  return jwt.sign({ userID }, process.env.SECRET, {
    expiresIn: process.env.EXPIRES_JWT
  });
}

const verifcation = async (token, secret) => {
  return jwt.verify(token, secret);
}


exports.createData = async (req, res) => {
  try {
    const data = await Serverless.create(req.body);
    const token = await getToken(data._id);
    const cookieOptions = {
      expires: new Date(Date.now() + 3600 * 1000),
      httpOnly: true
    };
    res.cookie('loginjwt', token, cookieOptions);
    res.status(200).json({
      status: "Success",
      U_token: token,
      data
    });
  } catch (error) {
    res.status(400).json({
      error
    });
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Please provide email and password!' });
    const loginUser = await Serverless.findOne({ email: email });
    if (!loginUser || !await loginUser.passwordCompare(password, loginUser.password)) {
      return res.status(401).json({ message: 'Incorrect email or Password!' });
    }
    const token1 = await getToken(loginUser._id);
    const cookieOptions = {
      expires: new Date(Date.now() + 3600 * 1000),
      httpOnly: true
    }
    res.cookie('loginjwt', token1, cookieOptions);
    res.status(200).json({
      result: 'Success',
      token1
    });
  } catch (error) {
    res.status(401).json({
      error
    });
  }
}

exports.getData = async (req, res) => {
  try {
    const allData = await Serverless.find();
    console.log(req);
    res.status(200).json({
      size: allData.length,
      result: allData
    });
  } catch (error) {
    res.status(400).json({
      error
    })
  }
}

exports.deleteOne = async (req, res) => {
  try {
    const data = await Serverless.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: `Deleted ${req.params.id}`
    });
  } catch (error) {
    res.status(400).json({
      error
    });
  }
}

exports.getOneData = async (req, res) => {
  try {
    const data = await Serverless.findById(req.params.id);
    if (!data) return res.status(404).json({ message: 'ID not Found! ' });
    res.status(200).json({
      result: data
    });
  } catch (error) {
    res.status(400).json({
      error
    });
  }
}

exports.updateOne = async (req, res) => {
  try {
    const updatedData = await Serverless.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!updatedData) return res.status(400).json({ message: 'Invalid ID, Could not updated!' });
    res.status(200).json({
      result: 'Success',
      data: updatedData
    });
  } catch (error) {
    res.status(400).json({
      error
    });
  }
}

exports.protect = async (req, res, next) => {
  try {
    let verifyToken;
    if (req.cookies.loginjwt) {
      verifyToken = req.cookies.loginjwt;
    }
    if (!verifyToken) {
      return res.status(401).json({ message: '401 | Unauthorized' });
    }
    const decode = await verifcation(verifyToken, process.env.SECRET);
    if (!decode) {
      return res.status(400).json({ message: 'Login Failed! Try Again' });
    }
    res.header('x-api-key', 'KQSTuzLX7Y27EH4TsvyyS8XUJJ1Zpntw5kg1HuLr');
    next();
  } catch (error) {
    res.status(400).json({
      error
    });
  }
}