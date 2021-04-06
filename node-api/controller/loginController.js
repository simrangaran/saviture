'use strict';
var User = require('../model/loginModel.js');


exports.register_user = function(req, res) {
  console.log("Hello from this side",JSON.parse(req.query.data)[0].name);
  User.registerUser(JSON.parse(req.query.data)[0], function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};

exports.login_user = function(req,res)
{
  console.log("Hello from this side",req.query);
  User.loginUser(req.query, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
}

exports.records = function(req,res)
{
  console.log("Hello from this side of records",req.query);
  User.records(req.query, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
}

