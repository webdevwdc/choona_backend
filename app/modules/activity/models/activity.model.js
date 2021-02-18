var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ActivitySchema = new Schema({
  from_user_id: {type: Schema.Types.ObjectId, ref: 'User'},
  to_user_id: {type: Schema.Types.ObjectId, ref: 'User'},
  post_id: {type: Schema.Types.ObjectId, ref: 'post',default:null},
  'activity_type':{type:String,default:'normal',enum:['following','comment','reaction']},
  'text':{type:String,default:''},
  'image':{type:String,default:''},
  isActive: { type: Boolean, default: true, enum: [true, false] },
  createdAt: {type: Date, default: Date.now}
 });

module.exports = mongoose.model('Activity', ActivitySchema);