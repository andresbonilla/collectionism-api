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
         
         it('does not create follow when given invalid attributes', function (done) {
              helper.signedInUser(function(err, res, body) {
                  var user1 = body.user;
                  helper.createFollow({
                      user: {
                          _id: user1._id,
                          auth_token: user1.auth_token 
                      },
                      follow: {
                          follower_id: user1._id,
                          followed_id: 'randomWrongId'
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
                    follower_id: user._id 
                }, function (follow) {
                    helper.destroyFollow({
                        user: {
                          _id: user._id,
                          auth_token: user.auth_token
                        },
                        follow: {
                            follower_id: user._id,
                            followed_id: follow.followed_id,
                        }
                    },
                    function (err, res, body) {
                        res.statusCode.should.be.equal(200);
                        body.destroyed.follow.follower_id.should.equal(user._id);
                        body.destroyed.follow.followed_id.should.equal(follow.followed_id);
                        done();
                    });
                });
            });
        });
        
        it('does not destroy a follow for invalid followed id', function (done) {
            helper.signedInUser(function (err, res, body) {
                var user = body.user;                      
                Factory.create('follow', { 
                    follower_id: user._id 
                }, function (follow) {
                    helper.destroyFollow({
                        user: {
                          _id: user._id,
                          auth_token: user.auth_token
                        },
                        follow: {
                            follower_id: user._id,
                            followed_id: 'randomWrongID',
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