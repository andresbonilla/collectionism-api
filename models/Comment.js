var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
            
var CommentSchema = new Schema({
	id      : Schema.ObjectId,
	text    : { type: String, required: true },
	userId  : { type: String, required: true, index: { unique: false, sparse: true }},
	lotId   : { type: String, index: { unique: false, sparse: true }},
	itemId  : { type: String, index: { unique: false, sparse: true }},
});

CommentSchema.path('text').validate(function (text) {
  return ( text && text.length >= 1 && text.length <= 10000 );
}, 'Comment length');

module.exports = mongoose.model('Comments', CommentSchema);
