var helper = require('./helper'),
  Follow = require('../models/Follow');

// POST /follows
exports.createFollow = function (req, res) {
    helper.authenticate(req, res, function() {
        Follow.create({
            follower_id: req.body.follow.follower_id,
            followed_id: req.body.follow.followed_id
        }, 
        function (err, follow) {
            res.contentType('json');
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
    });
}