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
                    body.lot.user_id.should.equal(user._id);
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
            Factory.create('lot', function (lot) {
                helper.getLot(lot._id, function (err, res, body) {
                    res.statusCode.should.be.equal(200);
                    body.lot.should.have.property('_id');
                    body.lot.name.should.equal(lot.name);
                    done();
                });
            });
        });

        it('returns an error for invalid lot id', function (done) {
            helper.getLot('randomWrongID', function (err, res, body) {
                res.statusCode.should.be.equal(400);
                body.error.message.should.equal('Bad lot id');
                done();
            });
        });

    });
    
    describe('update', function () {

        it('updates lot info for valid params', function (done) {
            helper.signedInUser(function (err, res, body) {
                var user = body.user;      
                Factory.create('lot', { 
                    user_id: user._id 
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
                    user_id: user._id
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
                    user_id: user._id 
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
                        body.destroyed.lot._id.should.equal(lot._id+'');
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
        
    });

})