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
    username: function(cb) { cb('testUser'+(userCount++)); },
    password: 'secret'
});

Factory.define('lot', Lot, {
    name: function(cb) { cb('testLot'+(lotCount++)); },
    user_id: Factory.assoc('user', '_id')
});

Factory.define('item', Item, {
    name: function(cb) { cb('testItem'+(itemCount++)); },
    desc: 'Vestibulum id ligula porta felis euismod semper.',
    user_id: Factory.assoc('user', '_id'),
    lot_id: Factory.assoc('lot', '_id'),
    img_url: 'http://testimgurl.com'
});

Factory.define('follow', Follow, {
    follower_id: Factory.assoc('user', '_id'),
    followed_id: Factory.assoc('user', '_id')    
});

Factory.define('itemComment', Comment, {
    user_id: Factory.assoc('user', '_id'),
    item_id: Factory.assoc('item', '_id'),
    text: 'sample comment text'
});

Factory.define('lotComment', Comment, {
    user_id: Factory.assoc('user', '_id'),
    lot_id: Factory.assoc('lot', '_id'),
    text: 'sample comment text'
});