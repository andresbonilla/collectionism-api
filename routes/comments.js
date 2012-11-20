var helper = require('./helper'),
   Comment = require('../models/Comment'),
      Item = require('../models/Item'),
       Lot = require('../models/Lot');
       
// POST /comments
exports.createComment = function (req, res) {
    helper.authenticate(req, res, function() {
        res.contentType('json');
        if (req.body.comment.item_id) {
            Item.findOne({
               _id: req.body.comment.item_id 
            }, function (err, item) {
                if (err || !item) {
                    res.json('400', {
                        error: {
                            message: 'Bad item ID'
                        }
                    });
                } else {
                    Comment.create({
                        user_id: req.body.user._id,
                        item_id: req.body.comment.item_id,
                        text: req.body.comment.text
                    }, function (err, comment) {
                        if (err) {
                            res.json('400', {
                                error: err
                            });
                        } else {
                            res.json('201', {
                                comment: {
                                    _id: comment._id,
                                    user_id: comment.user_id,
                                    item_id: comment.item_id,
                                    text: comment.text
                                }
                            });
                        }
                    });
                }
            });
        } else if (req.body.comment.lot_id) {
            Lot.findOne({
               _id: req.body.comment.lot_id 
            }, function (err, lot) {
                if (err || !lot) {
                    res.json('400', {
                        error: {
                            message: 'Bad lot ID'
                        }
                    });
                } else {
                    Comment.create({
                        user_id: req.body.user._id,
                        lot_id: req.body.comment.lot_id,
                        text: req.body.comment.text
                    }, function (err, comment) {
                        if (err) {
                            res.json('400', {
                                error: err
                            });
                        } else {
                            res.json('201', {
                                comment: {
                                    _id: comment._id,
                                    user_id: comment.user_id,
                                    lot_id: comment.lot_id,
                                    text: comment.text
                                }
                            });
                        }
                    });
                }
            });
        } else {
            res.json('400', {
                error: {
                    message: 'Missing lot or item ID'
                }
            });
        }
    });
}

// DELETE /comments
exports.destroyComment = function (req, res) {
    helper.authenticate(req, res, function() {
        res.contentType('json');
        Comment.findOne({
            _id: req.body.comment._id
        }, function (err, comment) {                
            if (err || !comment) {
                res.json('400', {
                   error: {
                       message: 'Bad comment ID'
                   } 
                });
            } else {                
                if (comment.user_id === req.body.user._id) {
                    comment.remove(function(err) {
                        if (err) {
                            res.json('400', {
                                error: err
                            });
                        } else {
                            res.json('200', {
                                destroyed: {
                                    comment: {
                                        _id: comment._id,
                                        item_id: comment.item_id,
                                        text:comment.text                                
                                    }
                                }
                            });
                        }
                    });
                } else {
                    if (comment.item_id) {
                        Item.findOne({
                            _id: comment.item_id
                        }, function (err, item) {
                            if (err) {
                                res.json(err);
                            } else if (!item) {
                                res.json('400', {
                                   error: {
                                       message: 'Bad item ID'
                                   } 
                                });
                            } else {
                                if (item.user_id === req.body.user._id) {
                                    comment.remove(function(err) {
                                        if (err) {
                                            res.json('400', {
                                                error: err
                                            });
                                        } else {
                                            res.json('200', {
                                                destroyed: {
                                                    comment: {
                                                        _id: comment._id,
                                                        item_id: comment.item_id,
                                                        text:comment.text                                
                                                    }
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    res.json('400', {
                                       error: {
                                           message: 'You do not own this comment or item.'
                                       } 
                                    });
                                }
                            }
                        });
                    } else if (comment.lot_id) {
                        Lot.findOne({
                            _id: comment.lot_id
                        }, function (err, lot) {
                            if (err) {
                                res.json(err);
                            } else if (!lot) {
                                res.json('400', {
                                   error: {
                                       message: 'Bad lot ID'
                                   } 
                                });
                            } else {
                                if (lot.user_id === req.body.user._id) {
                                    comment.remove(function(err) {
                                        if (err) {
                                            res.json('400', {
                                                error: err
                                            });
                                        } else {
                                            res.json('200', {
                                                destroyed: {
                                                    comment: {
                                                        _id: comment._id,
                                                        lot_id: comment.lot_id,
                                                        text:comment.text                                
                                                    }
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    res.json('400', {
                                       error: {
                                           message: 'You do not own this comment or lot.'
                                       } 
                                    });
                                }
                            }
                        });
                    } else {
                        res.json('400', {
                           error: {
                               message: 'Missing item or lot ID'
                           } 
                        });
                    }
                }
            }
        });            
    });
}