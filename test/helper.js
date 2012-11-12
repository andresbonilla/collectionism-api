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
            body: params
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
        body: params
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
        body: params
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
        body: params
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
        body: params
    },
    function (err, res, body) {
        done(err, res, body);
    });
}

exports.getLot = function(lot_id, done) {
    http({
        method: 'GET',
        url: url + '/lots/' + lot_id,
        json: true,
        body: {}
    },
    function (err, res, body) {        
       done(err, res, body);
    });
}

exports.updateLot = function(params, done) {
    http({
        method: 'PUT',
        url: url + '/lots/' + params.lot._id,
        json: true,
        body: params
    },
    function (err, res, body) {
        done(err, res, body);
    });
}

exports.destroyLot = function(params, done) {
    http({
        method: 'DELETE',
        url: url + '/lots/' + params.lot._id,
        json: true,
        body: params
    },
    function (err, res, body) {
        done(err, res, body);
    });
}