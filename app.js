const express = require('express');
const ServerlessHttp = require('serverless-http');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const getData = require("./Controller");
const cookieParser = require('cookie-parser');

// Database Connection.........................
const DB = process.env.DATABASE;
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
  .then(() => console.log("Database connection succesfull!"))
  .catch(() => console.log("Error Connecting"));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.post('/create', getData.createData);
app.post('/login', getData.login);
app.use('/protect', getData.protect);
app.get('/protect', getData.getData);
app.get('/protect/getOne/:id', getData.getOneData);
app.put('/protect/update/:id', getData.updateOne);
app.delete('/protect/delete/:id', getData.deleteOne);

// const port = process.env.PORT_NO || 8000;
// app.listen(port, () => {
//   console.log(`App is running on Port : ${port}.......`);
// });
module.exports.curdFunction = ServerlessHttp(app);