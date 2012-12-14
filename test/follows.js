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
                             followerId: user1._id,
                             followedId: user2._id
                         }
                     },
                     function (err, res, body) {
                         res.statusCode.should.be.equal(201);
                         body.follow.followerId.should.equal(user1._id+'');
                         body.follow.followedId.should.equal(user2._id+'');
                         done();
                     }); 
                 });
             });
         });
         
         it('does not create follow when given invalid attributes', function (done) {
              helper.signedInUser(function(err, res, body) {
                  var user1 = body.user;
                  helper.createFollow({
                      user: {
                          _id: user1._id,
                          auth_token: user1.auth_token 
                      },
                      follow: {
                          followerId: user1._id,
                          followedId: 'randomWrongId'
                      }
                  },
                  function (err, res, body) {
                      res.statusCode.should.be.equal(400);
                      body.error.message.should.equal('Bad user ID')
                      done();
                  }); 
              });
          });
        
    });
    
    describe('unfollow', function () {

        it('destroys a follow for valid params', function (done) {
            helper.signedInUser(function (err, res, body) {
                var user = body.user;                      
                Factory.create('follow', { 
                    followerId: user._id 
                }, function (follow) {
                    helper.destroyFollow({
                        user: {
                          _id: user._id,
                          auth_token: user.auth_token
                        },
                        follow: {
                            followerId: user._id,
                            followedId: follow.followedId,
                        }
                    },
                    function (err, res, body) {
                        res.statusCode.should.be.equal(200);
                        body.destroyed.follow.followerId.should.equal(user._id);
                        body.destroyed.follow.followedId.should.equal(follow.followedId);
                        done();
                    });
                });
            });
        });
        
        it('does not destroy a follow for invalid followed id', function (done) {
            helper.signedInUser(function (err, res, body) {
                var user = body.user;                      
                Factory.create('follow', { 
                    followerId: user._id 
                }, function (follow) {
                    helper.destroyFollow({
                        user: {
                          _id: user._id,
                          auth_token: user.auth_token
                        },
                        follow: {
                            followerId: user._id,
                            followedId: 'randomWrongID',
                        }
                    },
                    function (err, res, body) {
                        res.statusCode.should.be.equal(400);
                        body.error.message.should.equal('Bad followed ID');
                        done();
                    });
                });
            });
        });
        
    });
});