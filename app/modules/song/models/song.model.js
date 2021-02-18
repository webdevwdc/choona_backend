var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SongSchema = new Schema({
  user_id: {type: Schema.Types.ObjectId, ref: 'User'},
  post_id: {type: Schema.Types.ObjectId, ref: 'posts',default:null},
  song_name: { type:String,default:''},
  song_image: { type:String,default:''},
  song_uri: { type:String,default:''},
  original_song_uri: { type:String,default:''},
  artist_name: { type:String,default:''},
  album_name: { type:String,default:''},
  album_image: { type:String,default:''},
  type: { type:String,default:''},
  chat_id: { type:String,default:''},
  original_reg_type: { type:String,default:''},
  isrc_code: { type:String,default:''},
  isActive: { type: Boolean, default: true, enum: [true, false] },
  createdAt: {type: Date, default: Date.now}
 });

module.exports = mongoose.model('song', SongSchema);