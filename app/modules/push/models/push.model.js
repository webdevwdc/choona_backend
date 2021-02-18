var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deleted = [true, false];

var pushSchema = new Schema({
  title: {type: String, default: ''},
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User',default:null },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User',default:null },
  message: Object,
  date: {type: Date, default: Date.now},
  is_deleted: { type: String, default:false,enum:deleted }  
});


module.exports = mongoose.model('Push_Notification', pushSchema);