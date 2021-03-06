var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    Validations = require('./validations'),
    SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
	id        : Schema.ObjectId,
	username  : { type: String, required: true, index: { unique: true, sparse: true }},
	email     : { type: String, required: true, trim: true, index: { unique: true, sparse: true } },
	password  : { type: String, required: true},
	xp        : { type: Number, default: 0 },
	level     : { type: Number, default: 1 },
	coins     : { type: Number, default: 0 }
});

UserSchema.path('username').validate(Validations.uniqueFieldInsensitive('Users', 'username'), 'unique');
UserSchema.path('email').validate(Validations.uniqueFieldInsensitive('Users', 'email'), 'unique');
UserSchema.path('email').validate(Validations.emailFormat, 'email format');

UserSchema.pre('save', function(next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('Users', UserSchema);