var Factory = require('factory-lady'),
     helper = require('./helper'),
     should = require('should'),
       http = require('request');

describe('Item', function () {

    beforeEach(function (done) {
        helper.cleanDB(function () {
            done();
        });
    });

    describe('create', function () {

        it('creates a new follower given valid attributes and returns it', function (done) {
             helper.signedInUser(function(err, res, body) {
                 var user1 = body.user;
                 Factory.create('user', function(user2) {
                     helper.createFollow({
                         user: {
                             _id: user1._id,
                             auth_token: user1.auth_token 
                         },
                         follow: {
                             follower_id: user1._id,
                             followed_id: user2._id
                         }
                     },
                     function (err, res, body) {
                         res.statusCode.should.be.equal(201);
                         body.follow.follower_id.should.equal(user1._id+'');
                         body.follow.followed_id.should.equal(user2._id+'');
                         done();
                     }); 
                 });
             });
         });
        
    });
    
});