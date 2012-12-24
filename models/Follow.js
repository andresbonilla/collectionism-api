var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
        
var FollowSchema = new Schema({
	followerId : { type: Schema.Types.ObjectId, ref: 'follower', required: true, index: { unique: false, sparse: true }},
	followeeId : { type: Schema.Types.ObjectId, ref: 'followee', required: true, index: { unique: false, sparse: true }}
});

module.exports = mongoose.model('Follows', FollowSchema);