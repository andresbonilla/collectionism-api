var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
        
var LotSchema = new Schema({
	id      : Schema.ObjectId,
	name    : { type: String, required: true, index: { unique: false, sparse: true }},
	user_id : { type: String, required: true, index: { unique: false, sparse: true }}
});

module.exports = mongoose.model('Lots', LotSchema);