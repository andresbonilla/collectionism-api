var mongoose = require('mongoose'),
    mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost/collectionism-test',
          db = mongoose.connect(mongoURI);

exports.users = require('./users');