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
                http({
                    method: 'POST',
                    url: helper.url + '/lots',
                    json: true,
                    body: { 
                        user: {
                            _id: user._id,
                            auth_token: user.auth_token 
                        },
                        lot: {
                            name: 'testLot'
                        }
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

    });

})