var helper = require('./helper'),
    Follow = require('../models/Follow'),
      User = require('../models/User');

// POST /follows
exports.createFollow = function (req, res) {
    helper.authenticate(req, res, function() {
        res.contentType('json');
        User.findOne({
            _id: req.body.follow.followeeId
        }, function (err, user) {
            if (err) {
                res.json('400', {
                    error: {
                        message: 'Bad user ID'
                    }
                });
            } else {
                Follow.create({
                    followerId: req.body.follow.followerId,
                    followeeId: req.body.follow.followeeId
                }, 
                function (err, follow) {
                    if (err) {
                        res.json('400', {
                            error: err
                        });
                    } else {
                        res.json('201', {
                            follow: {
                                followerId: follow.followerId,
                                followeeId: follow.followeeId
                            }
                        });
                    }
                });
            }
        });
    });
}

// DELETE /follows
exports.destroyFollow = function (req, res) {
    helper.authenticate(req, res, function() {
        res.contentType('json');
        Follow.findOne({
            followerId: req.body.user._id,
            followeeId: req.body.follow.followeeId
        }, function (err, follow) {
            if (err) {
                res.json(err);
            } else if (!follow) {
                res.json('400', {
                   error: {
                       message: 'Bad followee ID'
                   } 
                });
            } else {
                follow.remove(function(err) {
                    if (err) {
                        res.json('400', {
                            error: err
                        });
                    } else {
                        res.json('200', {
                            destroyed: {
                                follow: {
                                    followerId: follow.followerId,
                                    followeeId: follow.followeeId                                    
                                }
                            }
                        });
                    }
                });
            }
        });            
    });
}