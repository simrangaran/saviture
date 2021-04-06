"user strict";

var mysql = require("mysql");

//local mysql db connection
var connection = mysql.createConnection({
  host:"localhost",
  //user: "ext-root",
  //password: "bsh0rder123#",
   //host:"localhost",

   user: "root",

   password: "root",
   //host:"localhost",
   //host:"54.169.182.151",  
   //user: "root",
  //password: "root",
  database: "hisabkitab"
});

connection.connect(function (err) {
  console.log("Connected");
  if (err) throw err;
});
module.exports = connection;
