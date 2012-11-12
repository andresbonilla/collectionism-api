var helper = require('./helper'),
       Lot = require('../models/Lot');

// POST /lots
exports.createLot = function (req, res) {
    helper.authenticate(req, res, function() {
        Lot.create({
            name: req.body.lot.name,
            user_id: req.body.user._id
        }, 
        function (err, lot) {
            res.contentType('json');
            if (err) {
                res.json(err);
            } else {
                res.json('201', {
                    lot: {
                        _id: lot._id,
                        name: lot.name,
                        user_id: lot.user_id
                    }
                });
            }
        });    
    });
}