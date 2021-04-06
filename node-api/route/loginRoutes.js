'use strict';
module.exports = function(app) {
  var UserController = require('../controller/loginController.js');

    app.route('/register')
    .get(UserController.register_user);
    
    app.route('/login')
    .get(UserController.login_user);

    app.route('/records')
    .get(UserController.records);

   };
   
   
