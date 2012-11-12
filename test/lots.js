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
                    res.statusCode.should.be.equal(200);
                    body.message.should.equal('Validation failed');
                    body.name.should.equal('ValidationError');
                    body.should.have.property('errors');
                    body.errors.name.name.should.equal('ValidatorError');
                    body.errors.name.type.should.equal('required');
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

        it('returns empty lot for invalid lot id', function (done) {
            helper.getLot('randomWrongID', function (err, res, body) {
                res.statusCode.should.be.equal(400);
                body.error.message.should.equal('Bad lot id');
                done();
            });
        });

    });

})