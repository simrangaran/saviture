module.exports.To = (promise) => {
    return promise.then(data => [false, data])
    .catch(err => [err, false]);
};

module.exports.ResponseError = function(res, err, code){ 
    let send_data = {success:false};
    if(typeof code !== 'undefined') res.statusCode = code;
    else res.statusCode = 500;
    send_data.error = err;
    if(typeof err == 'object' && typeof err.message != 'undefined'){
        send_data.error = err.message;
    } 
    return res.json(send_data);
};
module.exports.ResponseSuccess = function(res, data, code){
    let send_data = {success:true};
    if(typeof data == 'object'){
        send_data = Object.assign(send_data, data);
    }
    if(typeof code !== 'undefined') res.statusCode = code;
    return res.json(send_data);
};