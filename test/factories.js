var Factory = require('factory-lady'),
       User = require('../models/User');
    
var count = 1;

Factory.define('user', User, {
    username: function(cb) { cb('testUser'+(count++)); },
    password: 'secret'
});