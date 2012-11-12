var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
        
var LotSchema = new Schema({
	id      : Schema.ObjectId,
	name    : { type: String, required: true },
	user_id : { type: String, required: true }
});

module.exports = mongoose.model('Lots', LotSchema);