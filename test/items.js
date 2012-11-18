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
                        item: {
                            lot_id: lot._id,
                            name: 'testItem',
                            desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                            img_url: 'http://faketesturl.com'
                        }
                    },
                    function (err, res, body) {
                        res.statusCode.should.be.equal(201);
                        body.item.should.have.property('_id');
                        body.item.should.have.property('img_url');
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
                        item: {
                            lot_id: lot._id,
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
                        item: {
                            lot_id: lot._id,
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
            helper.signedInUser(function (err, res, body) {            
                Factory.create('item', function (item) {
                    helper.getItem({
                        user: {
                            _id: body.user._id,
                            auth_token: body.user.auth_token
                        },
                        item: {
                            _id: item._id
                        }
                    }, function (err, res, body) {
                        res.statusCode.should.be.equal(200);
                        body.item.should.have.property('_id');
                        body.item.name.should.equal(item.name);
                        done();
                    });
                });
            });
        });
        
        it('returns an error for invalid item id', function (done) {
            helper.signedInUser(function (err, res, body) {                        
                helper.getItem({
                    user: {
                        _id: body.user._id,
                        auth_token: body.user.auth_token
                    },
                    item: {
                        _id: 'randomWrongID'
                    }
                }, function (err, res, body) {
                    res.statusCode.should.be.equal(400);
                    body.error.message.should.equal('Bad item id');
                    done();
                });
            });
        });

    });

    describe('update', function () {

        it('updates item info for valid params', function (done) {
            helper.signedInUser(function (err, res, body) {
                var user = body.user;      
                Factory.create('item', { 
                    user_id: user._id 
                }, function (item) {
                    helper.updateItem({
                        user: {
                          _id: user._id,
                          auth_token: user.auth_token
                        },
                        item: {
                            _id: item._id,
                            name: 'New Item Name'
                        }
                    },
                    function (err, res, body) {
                        res.statusCode.should.be.equal(200);
                        body.item.name.should.equal('New Item Name');
                        done();
                    });
                });
            });
        });
        
        it('does not update item info for wrong user', function (done) {
            Factory.create('item', function (item) {
                helper.signedInUser(function (err, res, body) {
                    var user = body.user;
                    helper.updateItem({
                        user: {
                          _id: user._id,
                          auth_token: user.auth_token
                        },
                        item: {
                           _id: item._id,
                           name: 'New Item Name'
                        }
                    },
                    function (err, res, body) {                       
                        res.statusCode.should.be.equal(400);
                        body.error.message.should.equal('Item belongs to different user');
                        done();
                    });
                });
            });
        });
        
        it('does not update item info for invalid params', function (done) {
            helper.signedInUser(function (err, res, body) {
               var user = body.user;
               Factory.create('item', {
                   user_id: user._id
               }, function (item) {    
                   helper.updateItem({
                       user: {
                         _id: user._id,
                         auth_token: user.auth_token
                       },
                       item: {
                          _id: item._id,
                          name: ''
                       }
                   },
                   function (err, res, body) {                       
                       res.statusCode.should.be.equal(400);
                       body.error.message.should.equal('Nothing to update');
                       done();
                   });
               });
            });
        });
        
    });
    
    describe('destroy', function () {

        it('destroys an item for valid params', function (done) {
            helper.signedInUser(function (err, res, body) {
                var user = body.user;      
                Factory.create('item', { 
                    user_id: user._id 
                }, function (item) {
                    helper.destroyItem({
                        user: {
                          _id: user._id,
                          auth_token: user.auth_token
                        },
                        item: {
                           _id: item._id,
                        }
                    },
                    function (err, res, body) {
                        res.statusCode.should.be.equal(200);
                        body.destroyed.item._id.should.equal(item._id+'');
                        done();
                    });
                });
            });
        });
        
        it('does not destroy item for wrong user', function (done) {
            Factory.create('item', function (item) {
                helper.signedInUser(function (err, res, body) {
                    var user = body.user;
                    helper.destroyItem({
                        user: {
                          _id: user._id,
                          auth_token: user.auth_token
                        },
                        item: {
                           _id: item._id
                        }
                    },
                    function (err, res, body) {                       
                        res.statusCode.should.be.equal(400);
                        body.error.message.should.equal('Item belongs to different user');
                        done();
                    });
                });
            });
        });
        
    });
});