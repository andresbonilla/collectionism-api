var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
        
var ItemSchema = new Schema({
	id      : Schema.ObjectId,
	name    : { type: String, required: true },
	desc    : { type: String },	
	user_id : { type: String, required: true },
	lot_id  : { type: String, required: true },
	img_url : { type: String, required: true }
});

module.exports = mongoose.model('Items', ItemSchema);