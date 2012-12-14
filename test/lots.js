var Factory = require('factory-lady'),
     helper = require('./helper'),
     should = require('should'),
       http = require('request');

describe('Lot', function () {

    beforeEach(function (done) {
        helper.cleanDB(function () {
            done();
        });
    });

    describe('create', function () {

        it('creates a new lot given valid attributes and returns it', function (done) {
            helper.signedInUser(function(err, res, body) {
                var user = body.user;
                helper.createLot({
                    user: {
                        _id: user._id,
                        auth_token: user.auth_token 
                    },
                    lot: {
                        name: 'testLot'
                    }
                },
                function (err, res, body) {
                    res.statusCode.should.be.equal(201);
                    body.lot.should.have.property('_id');
                    body.lot.name.should.equal('testLot')
                    body.lot.userId.should.equal(user._id);
                    done();
                });
            });
        });
        
        it('returns validation failure for invalid attributes', function (done) {
            helper.signedInUser(function(err, res, body) {
                var user = body.user;
                helper.createLot({
                    user: {
                        _id: user._id,
                        auth_token: user.auth_token 
                    },
                    lot: {
                        name: ''
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
    
    describe('get', function () {

        it('returns lot info for valid lot id', function (done) {
            helper.signedInUser(function (err, res, body) {            
                Factory.create('lot', function (lot) {
                    helper.getLot({
                        user: {
                            _id: body.user._id,
                            auth_token: body.user.auth_token
                        },
                        lot: {
                            _id: lot._id
                        }
                    }, function (err, res, body) {
                        res.statusCode.should.be.equal(200);
                        body.lot.should.have.property('_id');
                        body.lot.name.should.equal(lot.name);
                        done();
                    });
                });
            });
        });

        it('returns an error for invalid lot id', function (done) {
            helper.signedInUser(function (err, res, body) {            
                helper.getLot({
                    user: {
                        _id: body.user._id,
                        auth_token: body.user.auth_token
                    },
                    lot: {
                        _id: 'randomID'
                    }
                }, function (err, res, body) {
                    res.statusCode.should.be.equal(400);
                    body.error.message.should.equal('Bad lot id');
                    done();
                });
            });
        });

    });
    
    describe('update', function () {

        it('updates lot info for valid params', function (done) {
            helper.signedInUser(function (err, res, body) {
                var user = body.user;      
                Factory.create('lot', { 
                    userId: user._id 
                }, function (lot) {
                    helper.updateLot({
                        user: {
                          _id: user._id,
                          auth_token: user.auth_token
                        },
                        lot: {
                           _id: lot._id,
                           name: 'New Lot Name'
                        }
                    },
                    function (err, res, body) {
                        res.statusCode.should.be.equal(200);
                        body.lot.name.should.equal('New Lot Name');
                        done();
                    });
                });
            });
        });
        
        it('does not update lot info for wrong user', function (done) {
            Factory.create('lot', function (lot) {
                helper.signedInUser(function (err, res, body) {
                    var user = body.user;
                    helper.updateLot({
                        user: {
                          _id: user._id,
                          auth_token: user.auth_token
                        },
                        lot: {
                           _id: lot._id,
                           name: 'New Lot Name'
                        }
                    },
                    function (err, res, body) {                       
                        res.statusCode.should.be.equal(400);
                        body.error.message.should.equal('Lot belongs to different user');
                        done();
                    });
                });
            });
        });
        
        it('does not update lot info for invalid params', function (done) {
            helper.signedInUser(function (err, res, body) {
                var user = body.user;
                Factory.create('lot', {
                    userId: user._id
                }, function (lot) {    
                    helper.updateLot({
                        user: {
                          _id: user._id,
                          auth_token: user.auth_token
                        },
                        lot: {
                           _id: lot._id,
                           name: ''
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

        it('destroys a lot for valid params', function (done) {
            helper.signedInUser(function (err, res, body) {
                var user = body.user;      
                Factory.create('lot', { 
                    userId: user._id 
                }, function (lot) {
                    helper.destroyLot({
                        user: {
                          _id: user._id,
                          auth_token: user.auth_token
                        },
                        lot: {
                           _id: lot._id,
                        }
                    },
                    function (err, res, body) {
                        res.statusCode.should.be.equal(200);
                        body.destroyed.lot._id.should.equal(lot._id.toString());
                        done();
                    });
                });
            });
        });
        
        it('does not destroy lot for wrong user', function (done) {
            Factory.create('lot', function (lot) {
                helper.signedInUser(function (err, res, body) {
                    var user = body.user;
                    helper.destroyLot({
                        user: {
                          _id: user._id,
                          auth_token: user.auth_token
                        },
                        lot: {
                           _id: lot._id,
                        }
                    },
                    function (err, res, body) {                       
                        res.statusCode.should.be.equal(400);
                        body.error.message.should.equal('Lot belongs to different user');
                        done();
                    });
                });
            });
        });
        
        it('destroys items in a lot when that lot is destroyed', function (done) {
            helper.signedInUser(function (err, res, body) {
                var user = body.user;      
                Factory.create('lot', { 
                    userId: user._id 
                }, function (lot) {
                    Factory.create('item', { 
                        userId: user._id,
                        lotId: lot._id
                    }, function (item) {
                        helper.destroyLot({
                            user: {
                              _id: user._id,
                              auth_token: user.auth_token
                            },
                            lot: {
                               _id: lot._id,
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
                                res.statusCode.should.be.equal(400);
                                body.error.message.should.equal('Bad item id');
                                done();
                            });
                        });
                    });
                });
            });
        });
        
    });

})