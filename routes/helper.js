if (process.env.REDISTOGO_URL) {
    // redistogo
    var redistogo = require("url").parse(process.env.REDISTOGO_URL);
    var redis = require("redis").createClient(redistogo.port, redistogo.hostname);
    redis.auth(redistogo.auth.split(":")[1]);
} else {
    var redis = require('redis').createClient();
}

exports.redis = redis;

exports.authenticate = function(req, res, done) {
    redis.hget('auth_tokens', req.body.user.auth_token, function (err, val) {
        if (val && val === req.body.user._id) {
            done();
        } else {
            res.contentType('json');
            res.json('200', {
                error: 'Bad auth token'
            });
        }
    });
}
