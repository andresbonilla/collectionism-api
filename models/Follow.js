var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
        
var FollowSchema = new Schema({
	followerId : { type: String, required: true, index: { unique: false, sparse: true }},
	followedId : { type: String, required: true, index: { unique: false, sparse: true }}
});

module.exports = mongoose.model('Follows', FollowSchema);