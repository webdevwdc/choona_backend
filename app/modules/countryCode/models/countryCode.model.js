var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var countryCodeSchema = new Schema({
  name: { type:String,default:''},
  dial_code: { type:String,default:''},
  code: { type:String,default:''},
  flag: { type:String,default:''},
  isActive: { type: Boolean, default: true, enum: [true, false] },
  createdAt: {type: Date, default: Date.now}
 });

module.exports = mongoose.model('country_code', countryCodeSchema);