var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatSchema = new Schema({
  sender_id: {type: Schema.Types.ObjectId, ref: 'User'},
  receiver_id: {type: Schema.Types.ObjectId, ref: 'User'},
  isActive: { type: Boolean, default: true, enum: [true, false] },
  createdAt: {type: Date, default: Date.now}
 });

module.exports = mongoose.model('chat', chatSchema);