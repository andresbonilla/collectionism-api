var helper = require('./helper'),
   Tagging = require('../models/Tagging'),
      Item = require('../models/Item');

// POST /taggings
exports.createTagging = function (req, res) {
    helper.authenticate(req, res, function() {
        Tagging.create({            
            itemId: req.body.tagging.itemId,
            lotId: req.body.tagging.lotId,
            tagText: req.body.tagging.tagText
        }, 
        function (err, tagging) {
            res.contentType('json');
            if (err) {
                res.json('400', {
                    error: err
                });
            } else {
                res.json('201', {
                    tagging: {
                        tagText: tagging.tagText,
                        itemId: tagging.itemId,
                        lotId: tagging.lotId
                    }
                });
            }
        });    
    });
}