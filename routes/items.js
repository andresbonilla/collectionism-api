var helper = require('./helper'),
       Lot = require('../models/Lot'),
      Item = require('../models/Item');

// POST /items
exports.createItem = function (req, res) {
    res.contentType('json');
    helper.authenticate(req, res, function() {
        Lot.findOne({
            _id: req.body.lot._id
        }, function (err, lot) {
            if (lot.user_id === req.body.user._id) {
                Item.create({
                    name: req.body.item.name,
                    desc: req.body.item.desc,
                    user_id: req.body.user._id,
                    lot_id: req.body.lot._id
                }, 
                function (err, item) {
                    if (err) {
                        res.json('400', {
                            error: err
                        });
                    } else {
                        res.json('201', {
                            item: {
                                _id: item._id,
                                name: item.name,
                                desc: item.desc,
                                user_id: item.user_id,
                                lot_id: item.lot_id
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
        });
    });
}

// GET /items/:id
exports.getItem = function (req, res) {
    Item.findOne({
        _id: req.params.id
    }, function (err, item) {
        res.contentType('json');
        if (err) {   
            res.json('400', {
                error: {
                    message: 'Bad item id'
                }
            });
        } else {
            res.json('200', {
                item: {
                    _id: item._id,
                    name: item.name,
                    desc: item.desc,
                    user_id: item.user_id,
                    lot_id: item.lot_id
                }
            });
        }
    });
}