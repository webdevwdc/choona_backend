var Push = require('push/models/push.model');
var mongoose = require('mongoose');

var pushRepository = {
    getAllPushWithId: function (id,cb) {
        Push.find({to:mongoose.Types.ObjectId(id)}).exec(function (err, result) {
            if (err) {
                return cb(err, null);
            } else {
                return cb(null, result);
            }
        });
    },
    getAllPushWithCondition: function (param,cb) {
        Push.find(param).populate('from to').lean().exec(function (err, result) {
            if (err) {
                return cb(err, null);
            } else {
                return cb(null, result);
            }
        });
    },
    getById: function (id, cb) {
        Push.findById(id, function (err, result) {
            if (err) {
                return cb(err, null);
            } else {
                return cb(null, result);
            }

        });
    },

    getByField: function (params, cb) {
        Push.findOne(params, function (err, result) {
            if (err) {
                return cb(err, null);
            } else {
                return cb(null, result);
            }

        });
    },

    updateById: function (data, id, cb) {
        Push.findByIdAndUpdate(id, data, function (err, result) {
            if (err)
                return cb(err, null);
            return cb(null, result);
        });
    },

    updateByField: function (field, fieldValue, data) {
        //todo: update by field
    },

    save: function (obj, cb) {
        var newPush = new Push(obj);
        newPush.save(function (err) {
            if (err) {
                return cb(err.message, null);
            } else {
                return cb(null, newPush);
            }
        });
    },

    delete: function (id, cb) {
        Push.remove({_id:id},function (err,result) {
            if (err) {
                return cb(err.message, null);
            } else {
                return cb(null, result);
            }
        });
    }
};



module.exports = pushRepository;