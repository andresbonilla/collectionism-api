var helper = require('./helper'),
    Follow = require('../models/Follow'),
      User = require('../models/User');

// POST /follows
exports.createFollow = function (req, res) {
    helper.authenticate(req, res, function() {
        res.contentType('json');
        User.findOne({
            _id: req.body.follow.followed_id
        }, function (err, user) {
            if (err) {
                res.json('400', {
                    error: {
                        message: 'Bad user ID'
                    }
                });
            } else {
                Follow.create({
                    follower_id: req.body.follow.follower_id,
                    followed_id: req.body.follow.followed_id
                }, 
                function (err, follow) {
                    if (err) {
                        res.json('400', {
                            error: err
                        });
                    } else {
                        res.json('201', {
                            follow: {
                                follower_id: follow.follower_id,
                                followed_id: follow.followed_id
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
            follower_id: req.body.user._id,
            followed_id: req.body.follow.followed_id
        }, function (err, follow) {
            if (err) {
                res.json(err);
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
                                    follower_id: follow.follower_id,
                                    followed_id: follow.followed_id                                    
                                }
                            }
                        });
                    }
                });
            }
        });            
    });
}