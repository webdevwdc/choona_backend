var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  user_id: {type: Schema.Types.ObjectId, ref: 'User'},
  social_type:{type:String,default:''},
  post_content:{type:String,default:''},
  song_uri:{type:String,default:''},
  original_song_uri:{type:String,default:''},
  genre:{type:String,default:''},
  song_name: { type:String,default:''},
  song_image: { type:String,default:''},
  artist_name: { type:String,default:''},
  album_name: { type:String,default:''},
  album_image: { type:String,default:''},
  comment :[],
  reaction :[],
  isrc_code: { type:String,default:''},
  isActive: { type: Boolean, default: true, enum: [true, false] },
  createdAt: {type: Date, default: Date.now}
 });

module.exports = mongoose.model('post', PostSchema);