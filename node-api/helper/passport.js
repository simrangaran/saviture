var sql = require('../model/db.js');
const { ExtractJwt, Strategy } = require('passport-jwt');
const CONFIG = require('../config/config.js');
module.exports = function(passport){
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = CONFIG.development.jwt_encryption;
    
    passport.use('jwt', new Strategy(opts, async function(jwt_payload, done){
        sql.query("Select * from user_login where user_id = ? ", jwt_payload.user_id, function (err, res) {             
            
            if(err) {
                done(err, null);
            } else {
                done(null, res);
            }
        });
    }));
}