var mongoose = require('mongoose'),
      Schema = mongoose.Schema;
        
var TaggingSchema = new Schema({
	lotId  : { type: String, index: { unique: false, sparse: true }},
	itemId : { type: String, index: { unique: false, sparse: true }},
	tagText : { type: String, required: true, index: { unique: true, sparse: true }}
});

module.exports = mongoose.model('Tagging', TaggingSchema);