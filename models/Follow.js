var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
        
var FollowSchema = new Schema({
	follower_id : { type: String, required: true, index: { unique: false, sparse: true }},
	followed_id : { type: String, required: true, index: { unique: false, sparse: true }}
});

module.exports = mongoose.model('Follows', FollowSchema);