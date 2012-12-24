var helper = require('./helper'),
       Lot = require('../models/Lot'),
      Item = require('../models/Item');

// POST /lots
exports.createLot = function (req, res) {
    helper.authenticate(req, res, function() {
        Lot.create({
            name: req.body.lot.name,
            userId: req.body.user._id
        }, 
        function (err, lot) {
            res.contentType('json');
            if (err) {
                res.json('400', {
                    error: err
                });
            } else {
                res.json('201', {
                    lot: {
                        _id: lot._id,
                        name: lot.name,
                        userId: lot.userId,
                        tags: lot.tags
                    }
                });
            }
        });    
    });
}

// GET /lots/:id
exports.getLot = function (req, res) {
    helper.authenticate(req, res, function() {
        Lot.findOne({
            _id: req.params.id
        }, function (err, lot) {
            res.contentType('json');
            if (err || !lot) {   
                res.json('400', {
                    error: {
                        message: 'Bad lot id'
                    }
                });
            } else {
                res.json('200', {
                    lot: {
                        _id: lot._id,
                        name: lot.name,
                        tags: lot.tags
                    }
                });
            }
        });
    });
}

// PUT /lots/:id
exports.updateLot = function (req, res) {
    helper.authenticate(req, res, function() {
        res.contentType('json');
        Lot.findOne({
            _id: req.params.id
        }, function (err, lot) {
            if (err) {
                res.json(err);
            } else {
                if (lot.userId === req.body.user._id) {
                    lot.name = req.body.lot.name;
                    lot.save(function(err) {
                        if (err) {
                            res.json('400', {
                                error: err
                            });
                        } else {
                            res.json('200', {
                                lot: {
                                    _id: lot._id,
                                    name: lot.name,
                                    userId: lot.userId,
                                    tags: lot.tags
                                }
                            });
                        }
                    });
                } else {
                    res.json('400', {
                        error:  {
                            message: 'Lot belongs to different user'
                        }
                    });
                }
            }
        });            
    });
}

// DELETE /lots/:id
exports.destroyLot = function (req, res) {
    helper.authenticate(req, res, function() {
        res.contentType('json');
        Lot.findOne({
            _id: req.params.id
        }, function (err, lot) {
            if (err) {
                res.json(err);
            } else {
                if (lot.userId === req.body.user._id) {
                    var lotId = lot._id;
                    lot.remove(function(err) {
                        if (err) {
                            res.json('400', {
                                error: err
                            });
                        } else {
                            Item.where('lotId').equals(lot._id).remove(function (err, count) {                                
                                if (err) {                                    
                                    res.json('400', {
                                        error: err
                                    });
                                } else {                                    
                                    res.json('200', {
                                        destroyed: {
                                            lot: {
                                                _id: lotId,
                                                name: lot.name,
                                                userId: lot.userId,
                                                tags: lot.tags
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });
                } else {
                    res.json('400', {
                        error:  {
                            message: 'Lot belongs to different user'
                        }
                    });
                }
            }
        });            
    });
}