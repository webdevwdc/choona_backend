var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var songSentSchema = new Schema({
  user_id: {type: Schema.Types.ObjectId, ref: 'User'},
  shared_user_id: {type: Schema.Types.ObjectId, ref: 'User'},
  song_id: { type:String},
  createdAt: {type: Date, default: Date.now}
 });

module.exports = mongoose.model('song_sent', songSentSchema);