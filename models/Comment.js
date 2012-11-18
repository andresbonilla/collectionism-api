var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
        
var CommentSchema = new Schema({
	id      : Schema.ObjectId,
	text    : { type: String, required: true },
	user_id : { type: String, required: true, index: { unique: false, sparse: true }},
	lot_id  : { type: String, index: { unique: false, sparse: true }},
	item_id : { type: String, index: { unique: false, sparse: true }},
});

module.exports = mongoose.model('Comments', CommentSchema);