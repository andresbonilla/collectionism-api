var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
        
var LotSchema = new Schema({
	id      : Schema.ObjectId,
	name    : { type: String, required: true, index: { unique: false, sparse: true }},
	userId  : { type: String, required: true, index: { unique: false, sparse: true }},
	tags    : [String]
});

module.exports = mongoose.model('Lots', LotSchema);