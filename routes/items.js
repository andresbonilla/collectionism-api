var helper = require('./helper'),
      Item = require('../models/Item');

// POST /items
exports.createItem = function (req, res) {
    helper.authenticate(req, res, function() {
        Item.create({
            name: req.body.item.name,
            desc: req.body.item.desc,
            user_id: req.body.user._id,
            lot_id: req.body.lot._id
        }, 
        function (err, item) {
            res.contentType('json');
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
    });
}