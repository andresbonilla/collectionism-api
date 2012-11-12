var helper = require('./helper'),
    bcrypt = require('bcrypt'),
    crypto = require('crypto'),
      User = require('../models/User');


// POST /signup
exports.signup = function (req, res) {
    User.create({
        username: req.body.user.username,
        password: req.body.user.password
    }, function (err, user) {
        res.contentType('json');
        if (err) {
            res.json(err);
        } else {
            res.json('201', {
                user: {
                    _id: user._id,
                    username: user.username
                }
            });
        }
    });
}

// POST /signin
exports.signin = function (req, res) {
    User.findOne({
        username: req.body.user.username
    }, function (err, user) {
        res.contentType('json');
        if (err) {
            res.json(err);
        } else {
            user.comparePassword(req.body.user.password, function (err, isMatch) {
                if (err) res.json(err);
                if (isMatch) {
                    crypto.randomBytes(48, function (ex, buf) {
                        var token = buf.toString('hex');

                        helper.redis.hset('auth_tokens', token, user._id, helper.redis.print);

                        res.json('200', {
                            user: {
                                _id: user._id,
                                username: user.username,
                                auth_token: token
                            }
                        });
                    });
                } else {
                    res.json('200', {
                        error: 'Bad username password pair'
                    });
                }
            });
        }
    });
}

// POST /signout
exports.signout = function (req, res) {
    helper.authenticate(req, res, function() {
        helper.redis.hdel('auth_tokens', req.body.user.auth_token, function (err, val) {
            if (err) {                        
                res.json(err);
            } else {                        
                res.json('200', {
                    message: "Bye!"
                });
            }
        });
    });    
}

// GET /users/:id
exports.getUser = function (req, res) {
    User.findOne({
        _id: req.params.id
    }, function (err, user) {
        res.contentType('json');
        if (err) {
            res.json(err);
        } else {
            res.json('200', {
                user: {
                    _id: user._id,
                    username: user.username
                }
            });
        }
    });
}

// GET /find/:username
//TOOD: Make it find SIMILAR usernames, not just the identical one.
exports.findUserByUsername = function (req, res) {
    User.find({
        username: req.params.username
    }, function (err, users) {
        res.contentType('json');
        if (err) {
            res.json(err);
        } else {
            var result = [];
            for (var i = 0; i < users.length; i += 1) {
                result.push({
                    _id: users[i]['_id'],
                    username: users[i]['username']
                });
            }
            res.json('200', result);
        }
    });
}

// PUT /users/:id
// for now, only the username is editable this way.
exports.updateUser = function (req, res) {
    helper.authenticate(req, res, function() {
        res.contentType('json');
        User.findOne({
            _id: req.params.id
        }, function (err, user) {
            if (err) {
                res.json(err);
            } else {
                user.username = req.body.user.username;
                user.save(function(err) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json('200', {
                            user: {
                                _id: user._id,
                                username: user.username
                            }
                        });
                    }
                });
            }
        });            
    });
}