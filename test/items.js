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

        it('creates a new item given valid attributes and returns it', function (done) {
            helper.signedInUser(function(err, res, body) {
                var user = body.user;
                Factory.create('lot', {
                    user_id: user._id
                }, function(lot) {
                    helper.createItem({
                        user: {
                            _id: user._id,
                            auth_token: user.auth_token 
                        },
                        lot: {
                            _id: lot._id
                        },
                        item: {
                            name: 'testItem',
                            desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
                        }
                    },
                    function (err, res, body) {
                        res.statusCode.should.be.equal(201);
                        body.item.should.have.property('_id');
                        body.item.name.should.equal('testItem')
                        body.item.user_id.should.equal(user._id+'');
                        body.item.lot_id.should.equal(lot._id+'');
                        done();
                    }); 
                });
            });
        });
        
        it('returns validation failure for invalid attributes', function (done) {
            helper.signedInUser(function(err, res, body) {
                var user = body.user;
                Factory.create('lot', {
                    user_id: user._id
                }, function(lot) {
                    helper.createItem({
                        user: {
                            _id: user._id,
                            auth_token: user.auth_token 
                        },
                        lot: {
                            _id: lot._id
                        },
                        item: {
                            name: '',
                            desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
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
        
        it('returns error for invalid lot_id attribute', function (done) {
            helper.signedInUser(function(err, res, body) {
                var user = body.user;
                Factory.create('lot', function(lot) {
                    helper.createItem({
                        user: {
                            _id: user._id,
                            auth_token: user.auth_token 
                        },
                        lot: {
                            _id: lot._id
                        },
                        item: {
                            name: 'testItem',
                            desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
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
    
    describe('get', function () {

        it('returns item info for valid item id', function (done) {
            Factory.create('item', function (item) {
                helper.getItem(item._id, function (err, res, body) {
                    res.statusCode.should.be.equal(200);
                    body.item.should.have.property('_id');
                    body.item.name.should.equal(item.name);
                    done();
                });
            });
        });
        
        it('returns an error for invalid item id', function (done) {
            helper.getItem('randomWrongID', function (err, res, body) {
                res.statusCode.should.be.equal(400);
                body.error.message.should.equal('Bad item id');
                done();
            });
        });

    });

});