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
                            itemId: item._id,
                            text: 'Sample comment text'
                        }
                    },
                    function (err, res, body) {
                        res.statusCode.should.be.equal(201);
                        body.comment.should.have.property('_id');
                        body.comment.text.should.equal('Sample comment text');
                        body.comment.itemId.should.equal(item._id.toString());
                        body.comment.userId.should.equal(user._id.toString());
                        done();
                    }); 
                });
            });
        });
        
        it('creates a new comment for a lot given valid attributes and returns it', function (done) {
            helper.signedInUser(function(err, res, body) {
                var user = body.user;
                Factory.create('lot', function(lot) {
                    helper.createComment({
                        user: {
                            _id: user._id,
                            auth_token: user.auth_token
                        },
                        comment: {
                            lotId: lot._id,
                            text: 'Sample comment text'
                        }
                    },
                    function (err, res, body) {
                        res.statusCode.should.be.equal(201);
                        body.comment.should.have.property('_id');
                        body.comment.text.should.equal('Sample comment text');
                        body.comment.lotId.should.equal(lot._id.toString());
                        body.comment.userId.should.equal(user._id.toString());
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
                             itemId: item._id,
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
    
    describe('tagging', function () {

        it('adds hashtags to an item through commenting', function (done) {
            helper.signedInUser(function(err, res, body) {
                var user = body.user;
                Factory.create('item', function(item) {
                    helper.createComment({
                        user: {
                            _id: user._id,
                            auth_token: user.auth_token
                        },
                        comment: {
                            itemId: item._id,
                            text: '#SamPle comment #tEst #text to test hashtags.'
                        }
                    },
                    function (err, res, body) {
                        helper.getItem({
                            user: {
                                _id: user._id,
                                auth_token: user.auth_token
                            },
                            item: {
                                _id: item._id
                            }
                        }, function (err, res, body) {
                            res.statusCode.should.be.equal(200);
                            body.item._id.should.equal(item._id.toString());
                            body.item.tags.length.should.equal(3);
                            body.item.tags[0].should.equal('sample');
                            body.item.tags[1].should.equal('test');
                            body.item.tags[2].should.equal('text');
                            done();
                        });
                    }); 
                });
            });
        });
        
        it('adds hashtags to a lot through commenting', function (done) {
            helper.signedInUser(function(err, res, body) {
                var user = body.user;
                Factory.create('lot', function(lot) {
                    helper.createComment({
                        user: {
                            _id: user._id,
                            auth_token: user.auth_token
                        },
                        comment: {
                            lotId: lot._id,
                            text: '#SamPle comment #tEst #text to test hashtags.'
                        }
                    },
                    function (err, res, body) {
                        helper.getLot({
                            user: {
                                _id: user._id,
                                auth_token: user.auth_token
                            },
                            lot: {
                                _id: lot._id
                            }
                        }, function (err, res, body) {
                            res.statusCode.should.be.equal(200);
                            body.lot._id.should.equal(lot._id.toString());
                            body.lot.tags.length.should.equal(3);
                            body.lot.tags[0].should.equal('sample');
                            body.lot.tags[1].should.equal('test');
                            body.lot.tags[2].should.equal('text');
                            done();
                        });
                    }); 
                });
            });
        });
        
    });
    
    describe('destroy', function () {

        it('destroys an item comment for valid params', function (done) {
            helper.signedInUser(function (err, res, body) {
                var user = body.user;                      
                Factory.create('itemComment', { 
                    userId: user._id 
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
                        body.destroyed.comment._id.should.equal(comment._id.toString());
                        done();
                    });
                });
            });
        });
        
        it('destroys a lot comment for valid params', function (done) {
            helper.signedInUser(function (err, res, body) {
                var user = body.user;                      
                Factory.create('lotComment', { 
                    userId: user._id 
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
                        body.destroyed.comment._id.should.equal(comment._id.toString());
                        done();
                    });
                });
            });
        });
        
        it('does not destroy a comment for invalid comment id', function (done) {
            helper.signedInUser(function (err, res, body) {
                var user = body.user;                      
                Factory.create('itemComment', { 
                    userId: user._id 
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