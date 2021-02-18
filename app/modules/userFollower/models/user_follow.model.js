var mongoose = require('mongoose');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var Schema = mongoose.Schema;

var userFollowerSchema = new Schema({
  user_id: {type: Schema.Types.ObjectId, ref: 'User'},
  follower_id: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: {type: Date, default: Date.now}
 });


 userFollowerSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('user_follower', userFollowerSchema);