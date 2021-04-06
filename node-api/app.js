
const express = require("express"),
  app = express(),
  bodyParser = require("body-parser");
  port = process.env.PORT || 3000;
var cors = require("cors");
const helmet = require('helmet');
app.use(cors());
app.options("*", cors());

//Cors

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

//basic authentication
/*const basicAuth=require('express-basic-auth')
app.use(basicAuth({
	users:{'admin':'Password2$'}
}))
*/
// For Security
app.use(helmet());

const mysql = require('mysql');
// pool connection configurations
var pool = mysql.createPool({

  connectionLimit: 100,
  host: "localhost",
  user: "root",
  password: "root",
  database: "hisabkitab",
});

// connect to database
//mc.connect();
exports.pool = pool;
//body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//Listening Port

var loginRoutes = require("./route/loginRoutes.js"); //importing route
loginRoutes(app); //register the route




/*app.get('*', (req, res) => res.status(200).send({
  message: 'Seem like you are lost',
})); */

module.exports = app;
app.listen(port);
console.log("API server started on: " + port);