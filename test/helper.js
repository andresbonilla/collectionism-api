var factories = require('./factories'),
      Factory = require('factory-lady'),
         User = require('../models/User'),
          Lot = require('../models/Lot'),
         Item = require('../models/Item'),
         http = require('request'),
          url = 'http://localhost:5000',
          app = require('../app');

/* Util */ 
	      
exports.url = url;

exports.JSON = function(params, done) {
    http({
        method: params.verb,
        url: params.url,
        json: true,
        body: params.body
    },
    function (err, res, body) {
        done(err, res, body);
    });
}
  
exports.cleanDB = function(done) {
    // TODO: find a less hard-coded way to drop all collections
    User.collection.drop(function(err) {
        Lot.collection.drop(function(err) {
            Item.collection.drop(function(err) {
                done(err);
            });
        });
    });
}
 
/* Users */ 
    
exports.signedInUser = function(done) {
    Factory.create('user', { password: 'secret' }, function (user) {
        exports.JSON ({
            verb: 'POST',
            url: url + '/signin', 
            body: { user: { username:user.username, password:'secret' } }
        }, done);
    });
}
    
exports.getUser = function(params, done) {
    exports.JSON ({
        verb: 'GET',
        url: url + '/users/' + params.user.get_id, 
        body: params
    }, done);
}

exports.findByUsername = function(params, done) {
    exports.JSON ({
        verb: 'GET',
        url: url + '/find/' + params.user.find_username,
        body: params
    }, done);
}
    
exports.updateUser = function(params, done) {
    exports.JSON ({
        verb: 'PUT',
        url: url + '/users/' + params.user._id, 
        body: params
    }, done);
}
    
exports.signup = function(params, done) {
    exports.JSON ({
        verb: 'POST',
        url: url + '/signup', 
        body: params
    }, done);
}
    
exports.signin = function(params, done) {
    exports.JSON ({
        verb: 'POST',
        url: url + '/signin', 
        body: params
    }, done);
}
    
exports.signout = function(params, done) {
    exports.JSON ({
        verb: 'POST',
        url: url + '/signout', 
        body: params
    }, done);
}

/* Lots */ 

exports.createLot = function(params, done) {
    exports.JSON ({
        verb: 'POST',
        url: url + '/lots', 
        body: params
    }, done);
}

exports.getLot = function(params, done) {
    exports.JSON ({
        verb: 'GET',
        url: url + '/lots/' + params.lot._id,
        body: params
    }, done);
}

exports.updateLot = function(params, done) {
    exports.JSON ({
        verb: 'PUT',
        url: url + '/lots/' + params.lot._id,
        body: params
    }, done);
}

exports.destroyLot = function(params, done) {
    exports.JSON ({
        verb: 'DELETE',
        url: url + '/lots/' + params.lot._id,
        body: params
    }, done);
}

/* Items */

exports.createItem = function(params, done) {
    exports.JSON ({
        verb: 'POST',
        url: url + '/items', 
        body: params
    }, done);
}

exports.getItem = function(params, done) {
    exports.JSON ({
        verb: 'GET',
        url: url + '/items/' + params.item._id,
        body: params
    }, done);
}

exports.updateItem = function(params, done) {
    exports.JSON ({
        verb: 'PUT',
        url: url + '/items/' + params.item._id,
        body: params
    }, done);
}

exports.destroyItem = function(params, done) {
    exports.JSON ({
        verb: 'DELETE',
        url: url + '/items/' + params.item._id,
        body: params
    }, done);
}