var mongoose  = require('mongoose'),
	factories = require('./factories'),
      Factory = require('factory-lady'),
         User = require('../models/User'),
          Lot = require('../models/Lot'),
         http = require('request'),
          url = 'http://localhost:5000',
          app = require('../app');

/* Util */ 
	      
exports.url = url;
  
exports.cleanDB = function(done) {
    // TODO: find a less hard-coded way to drop all collections
    User.collection.drop(function(err) {
        Lot.collection.drop(function(err) {
            done(err);
        });
    });
}
 
/* Users */ 
    
exports.signedInUser = function(done) {
    Factory.create('user', { password: 'secret' }, function (user) {
        http({
            method: 'POST',
            url: url + '/signin',
            json: true,
            body: { 
                user: {
                    username:user.username,
                    password:'secret' 
                }
            }
        },
        function (err, res, body) {
            done(err, res, body);
        });
    });
}
    
exports.getUser = function(user_id, done) {
    http({
        method: 'GET',
        url: url + '/users/' + user_id,
        json: true,
        body: {}
    },
    function (err, res, body) {
       done(err, res, body);
    });
}
    
exports.updateUser = function(params, done) {
        http({
            method: 'PUT',
            url: url + '/users/' + params.user._id,
            json: true,
            body: {
                user: {
                    _id: params.user._id,
                    username: params.user.username,
                    auth_token: params.user.auth_token
                }
            }
        },
        function (err, res, body) {
            done(err, res, body);
        });
}
    
exports.signup = function(params, done) {
    http({
        method: 'POST',
        url: url + '/signup',
        json: true,
        body: {
            user: {
                username: params.user.username,
                password: params.user.password
            }
        }
    },
    function (err, res, body) {
        done(err, res, body);
    });
}
    
exports.signin = function(params, done) {
    http({
        method: 'POST',
        url: url + '/signin',
        json: true,
        body: {
            user: {
                username: params.user.username,
                password: params.user.password
            }
        }
    },
    function (err, res, body) {
        done(err, res, body);
    });
}
    
exports.signout = function(params, done) {
    http({
        method: 'POST',
        url: url + '/signout',
        json: true,
        body: {
            user: {
                _id: params.user._id,
                auth_token: params.user.auth_token
            }
        }
    },
    function (err, res, body) {
        done(err, res, body);
    });
}

/* Lots */ 

exports.createLot = function(params, done) {
    http({
        method: 'POST',
        url: url + '/lots',
        json: true,
        body: { 
            user: {
                _id: params.user._id,
                auth_token: params.user.auth_token 
            },
            lot: {
                name: params.lot.name
            }
        }
    },
    function (err, res, body) {
        done(err, res, body);
    });
}