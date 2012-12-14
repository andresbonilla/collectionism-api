var Factory = require('factory-lady'),
     helper = require('./helper'),
     should = require('should'),
       http = require('request');

describe('Tagging', function () {

    beforeEach(function (done) {
        helper.cleanDB(function () {
            done();
        });
    });

    describe('create', function () {

        it('creates a new item tagging given valid attributes and returns it', function (done) {
            helper.signedInUser(function(err, res, body) {
                var user = body.user;
                Factory.create('item', function(item) {                
                    helper.createTagging({
                        user: {
                            _id: user._id,
                            auth_token: user.auth_token
                        },
                        tagging: {
                            itemId: item._id,
                            tagText: 'stamps'
                        }
                    },
                    function (err, res, body) {
                        res.statusCode.should.be.equal(201);
                        body.tagging.itemId.should.equal(item._id.toString());
                        body.tagging.should.have.property('tagText');
                        body.tagging.tagText.should.equal('stamps')
                        done();
                    }); 
                });
            });
        });
    });
});