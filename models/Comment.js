var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
            
var CommentSchema = new Schema({
	id      : Schema.ObjectId,
	text    : { type: String, required: true },
	userId  : { type: Schema.Types.ObjectId, ref: 'user', required: true, index: { unique: false, sparse: true }},
	lotId   : { type: Schema.Types.ObjectId, ref: 'lot', index: { unique: false, sparse: true }},
	itemId  : { type: Schema.Types.ObjectId, ref: 'item', index: { unique: false, sparse: true }},
});

CommentSchema.path('text').validate(function (text) {
  return ( text && text.length >= 1 && text.length <= 10000 );
}, 'Comment length');

module.exports = mongoose.model('Comments', CommentSchema);
