var Factory = require('factory-lady'),
       User = require('../models/User'),
        Lot = require('../models/Lot');
    
var userCount = 1,
     lotCount = 1;

Factory.define('user', User, {
    username: function(cb) { cb('testUser'+(userCount++)); },
    password: 'secret'
});

Factory.define('lot', Lot, {
    name: function(cb) { cb('testLot'+(lotCount++)); },
    user_id: Factory.assoc('user', '_id')
});