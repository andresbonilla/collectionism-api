var Factory = require('factory-lady'),
     helper = require('./helper'),
     should = require('should'),
       http = require('request');

describe('Comment', function () {

    beforeEach(function (done) {
        helper.cleanDB(function () {
            done();
        });
    });

    describe('create', function () {

        it('creates a new comment for an item given valid attributes and returns it', function (done) {
            helper.signedInUser(function(err, res, body) {
                var user = body.user;
                Factory.create('item', function(item) {
                    helper.createComment({
                        user: {
                            _id: user._id,
                            auth_token: user.auth_token
                        },
                        comment: {
                            item_id: item._id,
                            text: 'Sample comment text'
                        }
                    },
                    function (err, res, body) {
                        res.statusCode.should.be.equal(201);
                        body.comment.should.have.property('_id');
                        body.comment.text.should.equal('Sample comment text');
                        body.comment.user_id.should.equal(user._id+'');
                        done();
                    }); 
                });
            });
        });
        
        it('does not create comment when given invalid attributes', function (done) {
             helper.signedInUser(function(err, res, body) {
                 var user = body.user;
                 Factory.create('item', function(item) {
                     helper.createComment({
                         user: {
                             _id: user._id,
                             auth_token: user.auth_token
                         },
                         comment: {
                             item_id: item._id,
                             text: ''
                         }
                     },
                     function (err, res, body) {
                         res.statusCode.should.be.equal(400);
                         body.error.message.should.equal('Validation failed');
                         done();
                     }); 
                 });
             });
            
        });
        
    });
    
    describe('destroy', function () {

        it('destroys a comment for valid params', function (done) {
            helper.signedInUser(function (err, res, body) {
                var user = body.user;                      
                Factory.create('comment', { 
                    user_id: user._id 
                }, function (comment) {
                    helper.destroyComment({
                        user: {
                          _id: user._id,
                          auth_token: user.auth_token
                        },
                        comment: {
                            _id: comment._id,
                        }
                    },
                    function (err, res, body) {
                        res.statusCode.should.be.equal(200);
                        body.destroyed.comment._id.should.equal(comment._id+'');
                        done();
                    });
                });
            });
        });
        
        it('does not destroy a comment for invalid comment id', function (done) {
            helper.signedInUser(function (err, res, body) {
                var user = body.user;                      
                Factory.create('comment', { 
                    user_id: user._id 
                }, function (comment) {
                    helper.destroyComment({
                        user: {
                          _id: user._id,
                          auth_token: user.auth_token
                        },
                        comment: {
                            _id: 'WrongCommentID'
                        }
                    },
                    function (err, res, body) {
                        res.statusCode.should.be.equal(400);
                        body.error.message.should.equal('Bad comment ID');
                        done();
                    });
                });
            });
        });
        
    });
    
});