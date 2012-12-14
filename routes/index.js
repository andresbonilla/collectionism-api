var mongoose = require('mongoose'),
    mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost/collectionism-test',
          db = mongoose.connect(mongoURI);

exports.users = require('./users');
exports.lots = require('./lots');
exports.items = require('./items');
exports.follows = require('./follows');
exports.comments = require('./comments');
exports.taggings = require('./taggings');