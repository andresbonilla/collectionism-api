var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
        
var ItemSchema = new Schema({
	id      : Schema.ObjectId,
	name    : { type: String, required: true, index: { unique: false, sparse: true }},
	desc    : { type: String },	
	userId  : { type: String, required: true, index: { unique: false, sparse: true }},
	lotId   : { type: String, required: true, index: { unique: false, sparse: true }},
	imgUrl  : { type: String, required: true },
	tags    : [String]
});

module.exports = mongoose.model('Items', ItemSchema);