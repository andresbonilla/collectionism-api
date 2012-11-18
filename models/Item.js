var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
        
var ItemSchema = new Schema({
	id      : Schema.ObjectId,
	name    : { type: String, required: true, index: { unique: false, sparse: true }},
	desc    : { type: String },	
	user_id : { type: String, required: true, index: { unique: false, sparse: true }},
	lot_id  : { type: String, required: true, index: { unique: false, sparse: true }},
	img_url : { type: String, required: true }
});

module.exports = mongoose.model('Items', ItemSchema);