var Factory = require('factory-lady'),
     helper = require('./helper'),
     should = require('should'),
       http = require('request');

describe('User', function () {

    beforeEach(function (done) {
        helper.cleanDB(function () {
            done();
        });
    });

    describe('signup', function () {

        it('creates a new user given valid attributes and returns it', function (done) {
            helper.signup({
                user: {
                    username: 'testuser',
                    password: 'secret'
                }
            }, 
            function (err, res, body) {
                res.statusCode.should.be.equal(201);
                body.user.should.have.property('_id');
                body.user.username.should.equal('testuser');
                done();
            });
        });

        it('returns validation failure for invalid attributes', function (done) {
            helper.signup({
                user: {
                    username: '',
                    password: 'secret'
                }
            },
            function (err, res, body) {
                res.statusCode.should.be.equal(200);
                body.message.should.equal('Validation failed');
                body.name.should.equal('ValidationError');
                body.should.have.property('errors');
                body.errors.username.name.should.equal('ValidatorError');
                body.errors.username.type.should.equal('required');
                done();
            });
        });

        it('returns validation failure errors for duplicate usernames', function (done) {
            Factory.create('user', function (user) {
                helper.signup({
                    user: {
                        username: user.username,
                        password: 'secret'
                    }
                },
                function (err, res, body) {
                    res.statusCode.should.be.equal(200);
                    body.message.should.equal('Validation failed');
                    body.name.should.equal('ValidationError');
                    body.should.have.property('errors');
                    body.errors.username.name.should.equal('ValidatorError');
                    body.errors.username.type.should.equal('unique');
                    done();
                });
            });
        });

    });
    
    describe('signin', function () {
       
        it('authenticates users with correct username and password pair', function (done) {
            helper.signedInUser(function (err, res, body) {
                var user = body.user;
                // now do something that requires authentication using this auth token
               helper.updateUser({
                   user: {
                      _id: user._id,
                      username: 'brandNewUsername',
                      auth_token: user.auth_token
                   }
                },
                function (err, res, body) {
                    res.statusCode.should.be.equal(200);
                    body.user._id.should.equal(user._id);
                    body.user.username.should.equal('brandNewUsername');
                    done();
                });
            });
        });

        it('does not authenticate users with incorrect username and password pair', function (done) {
            Factory.create('user', {
                password: 'secret'
            }, function (user) {
                helper.signin({
                    user: {
                        username: user.username,
                        password: 'wrongPassword'
                    }
                }, 
                function (err, res, body) {
                    res.statusCode.should.be.equal(200);
                    body.should.have.property('error');
                    body.should.not.have.property('auth_token');
                    done();
                });
            });
        });
    });
    
    describe('signout', function () {
       
        it('signs out users with correct user id and auth token pair', function (done) {
            helper.signedInUser(function (err, res, body) {                
                var user = body.user;
                helper.signout({
                    user: {
                        _id: user._id,
                        auth_token: user.auth_token
                    }
                },
                function (err, res, body) {                    
                    res.statusCode.should.be.equal(200);                    
                    body.message.should.be.equal('Bye!')
                    // now check that i am signed out                    
                    helper.updateUser({
                        user: {
                            _id: user._id,
                            username: 'newusername',
                            auth_token: user.auth_token
                        }
                    },
                    function (err, res, body) {
                        res.statusCode.should.be.equal(200);
                        body.should.have.property('error');
                        done();
                    });
                });
            });
        });
        
        it('does not sign out users with incorrect user id and auth token pairs', function (done) {
            helper.signedInUser(function (err, res, body) {
                var user = body.user;
                helper.signout({
                    user: {
                        _id: user._id,
                        auth_token: 'badauthtoken'
                    }
                },
                function (err, res, body) {
                    res.statusCode.should.be.equal(200);
                    body.should.have.property('error');
                    // now check that i am not signed out
                    helper.updateUser({
                        user: {
                           _id: user._id,
                           username: 'brandNewUsername',
                           auth_token: user.auth_token
                        }
                     },
                    function (err, res, body) { 
                        res.statusCode.should.be.equal(200);
                        body.user._id.should.equal(user._id + '');
                        body.user.username.should.equal('brandNewUsername');
                        done();
                    });
                });
            });
        });
    });

    describe('get', function () {

        it('returns user info for valid user id', function (done) {
            Factory.create('user', function (user) {
                helper.getUser(user._id, function (err, res, body) {
                    res.statusCode.should.be.equal(200);
                    body.user.should.have.property('_id');
                    body.user.username.should.equal(user.username);
                    done();
                });
            });
        });

        it('returns empty object for invalid user id', function (done) {
            helper.getUser('randomWrongID', function (err, res, body) {
                res.statusCode.should.be.equal(400);
                body.error.message.should.equal('Bad user id');
                done();
            });
        });

    });
    
    describe('update', function () {

        it('updates user info for valid params', function (done) {
            helper.signedInUser(function (err, res, body) {
                var user = body.user;
                helper.updateUser({
                       user: {
                          _id: user._id,
                          username: 'brandNewUsername',
                          auth_token: user.auth_token
                       }
                    },
                    function (err, res, body) {
                        helper.getUser(user._id, function (err, res, body) {
                            res.statusCode.should.be.equal(200);
                            body.user.username.should.equal('brandNewUsername');
                            done();
                        });
                    });
            });
        });
        
        it('does not update user info for duplicate usernames', function (done) {
            Factory.create('user', function (user1) {
                helper.signedInUser(function (err, res, body) {
                    var user2 = body.user;
                    helper.updateUser({
                           user: {
                              _id: user2._id,
                              username: user1.username,
                              auth_token: user2.auth_token
                           }
                        },
                        function (err, res, body) {                       
                            res.statusCode.should.be.equal(200);
                            body.message.should.equal('Validation failed');
                            done();
                        });
                });
            });
            
            
        });
        
    });

    describe('find by username', function () {

        it('returns an array of users with username similar to the specified username', function (done) {
            Factory.create('user', function (user) {
                http({
                    method: 'GET',
                    url: helper.url + '/find/' + user.username,
                    json: true,
                    body: {}
                },
                function (err, res, body) {
                    res.statusCode.should.be.equal(200);
                    body[0].should.have.property('_id');
                    body[0].username.should.equal(user.username);
                    done();
                });
            });
        });

        it('returns an empty array if no users have a similar username', function (done) {
            http({
                method: 'GET',
                url: helper.url + '/find/unnownUsername',
                json: true,
                body: {}
            },
            function (err, res, body) {
                res.statusCode.should.be.equal(200);
                JSON.stringify(body).should.equal('[]');
                done();
            });

        });

    });

})