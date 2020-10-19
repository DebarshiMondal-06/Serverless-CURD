const Serverless = require('./Model');

exports.createData = async (req, res) => {
  try {
    const data = await Serverless.create(req.body);
    res.status(200).json({
      status: "Success",
      result: data
    });
  } catch (error) {
    res.status(400).json({
      error
    });
  }
}

exports.getData = async (req, res) => {
  try {
    const allData = await Serverless.find();
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