var helper = require('./helper'),
   Comment = require('../models/Comment'),
      Item = require('../models/Item'),
       Lot = require('../models/Lot');

function tagsInComment(comment) {
    var tags = comment.match(/#([A-Za-z0-9_]+)/g);
    if (tags && tags.length > 0) {
        tags = Array.prototype.map.call(tags, function (tag) {
            return tag.toLowerCase().replace('#','');
        }) ;
        return tags;
    } else {
        return null;
    }
}

// POST /comments
exports.createComment = function (req, res) {
    helper.authenticate(req, res, function() {
        res.contentType('json');
        if (req.body.comment.itemId) {
            Item.findOne({
               _id: req.body.comment.itemId 
            }, function (err, item) {
                if (err || !item) {
                    res.json('400', {
                        error: {
                            message: 'Bad item ID'
                        }
                    });
                } else {
                    Comment.create({
                        userId: req.body.user._id,
                        itemId: req.body.comment.itemId,
                        text: req.body.comment.text
                    }, function (err, comment) {
                        if (err) {
                            res.json('400', {
                                error: err
                            });
                        } else {
                            var newTags = tagsInComment(comment.text);
                            if (newTags) {
                                Item.update({ _id:item._id }, { $addToSet: { tags: { $each: newTags }}}, function (err, numberAffected, raw) {
                                  if (err) {
                                      res.json('400', {
                                          error: {
                                              message: err
                                          }
                                      });
                                  } else {
                                      res.json('201', {
                                          comment: {
                                              _id: comment._id,
                                              userId: comment.userId,
                                              itemId: comment.itemId,
                                              text: comment.text
                                          }
                                      });
                                  }
                                });
                            } else {
                                res.json('201', {
                                    comment: {
                                        _id: comment._id,
                                        userId: comment.userId,
                                        itemId: comment.itemId,
                                        text: comment.text
                                    }
                                });
                            }
                        }
                    });
                }
            });
        } else if (req.body.comment.lotId) {
            Lot.findOne({
               _id: req.body.comment.lotId 
            }, function (err, lot) {
                if (err || !lot) {
                    res.json('400', {
                        error: {
                            message: 'Bad lot ID'
                        }
                    });
                } else {
                    Comment.create({
                        userId: req.body.user._id,
                        lotId: req.body.comment.lotId,
                        text: req.body.comment.text
                    }, function (err, comment) {
                        if (err) {
                            res.json('400', {
                                error: err
                            });
                        } else {
                            var newTags = tagsInComment(comment.text);
                            if (newTags) {
                                Lot.update({ _id:lot._id }, { $addToSet: { tags: { $each: newTags }}}, function (err) {
                                  if (err) {
                                      res.json('400', {
                                          error: {
                                              message: err
                                          }
                                      });
                                  } else {
                                      res.json('201', {
                                          comment: {
                                              _id: comment._id,
                                              userId: comment.userId,
                                              lotId: comment.lotId,
                                              text: comment.text
                                          }
                                      });
                                  }
                                });
                            } else {
                                res.json('201', {
                                    comment: {
                                        _id: comment._id,
                                        userId: comment.userId,
                                        lotId: comment.lotId,
                                        text: comment.text
                                    }
                                });
                            }
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
                if (comment.userId.toString() === req.body.user._id.toString()) {                    
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
                                        itemId: comment.itemId,
                                        text:comment.text
                                    }
                                }
                            });
                        }
                    });
                } else {
                    if (comment.itemId) {
                        Item.findOne({
                            _id: comment.itemId
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
                                if (item.userId.toString() === req.body.user._id.toString()) {
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
                                                        itemId: comment.itemId,
                                                        text:comment.text                                
                                                    }
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    res.json('400', {
                                       error: {
                                           message: 'Bad user ID'
                                       } 
                                    });
                                }
                            }
                        });
                    } else if (comment.lotId) {
                        Lot.findOne({
                            _id: comment.lotId
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
                                if (lot.userId.toString() === req.body.user._id.toString()) {
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
                                                        lotId: comment.lotId,
                                                        text:comment.text
                                                    }
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    res.json('400', {
                                       error: {
                                           message: 'Bad user ID'
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