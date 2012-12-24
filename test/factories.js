var Factory = require('factory-lady'),
       User = require('../models/User'),
        Lot = require('../models/Lot'),
       Item = require('../models/Item')
     Follow = require('../models/Follow'),
    Comment = require('../models/Comment');

var userCount = 1,
     lotCount = 1,
    itemCount = 1;

Factory.define('user', User, {
    username: function(cb) { cb('testUser'+(userCount)); },
    password: 'secret',
    email: function(cb) { cb('testUser'+(userCount++)+'@gmail.com'); }
});

Factory.define('lot', Lot, {
    name: function(cb) { cb('testLot'+(lotCount++)); },
    userId: Factory.assoc('user', '_id')
});

Factory.define('item', Item, {
    name: function(cb) { cb('testItem'+(itemCount++)); },
    desc: 'Vestibulum id ligula porta felis euismod semper.',
    userId: Factory.assoc('user', '_id'),
    lotId: Factory.assoc('lot', '_id'),
    imgUrl: 'http://testimgurl.com'
});

Factory.define('follow', Follow, {
    followerId: Factory.assoc('user', '_id'),
    followeeId: Factory.assoc('user', '_id')
});

Factory.define('itemComment', Comment, {
    userId: Factory.assoc('user', '_id'),
    itemId: Factory.assoc('item', '_id'),
    text: 'sample comment text'
});

Factory.define('lotComment', Comment, {
    userId: Factory.assoc('user', '_id'),
    lotId: Factory.assoc('lot', '_id'),
    text: 'sample comment text'
});