var mongoose = require('mongoose');

exports.uniqueFieldInsensitive = function (modelName, field) {
    return function (val, cb) {
        if (val && val.length) { // if string not empty/null

            var query = mongoose.models[modelName].where(field, new RegExp('^' + val + '$', 'i')) // lookup the collection for somthing that looks like this field 

            if (!this.isNew) { // if update, make sure we are not colliding with itself
                query = query.where('_id').ne(this._id)
            }

            query.count(function (err, n) {
                // false when validation fails
                cb(n < 1)
            })
        } else { // raise error of unique if empty // may be confusing, but is rightful
            cb(false)
        }
    }
}

exports.emailFormat = function (val) {
    return (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(val)
}