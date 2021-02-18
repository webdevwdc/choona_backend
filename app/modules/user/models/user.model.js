var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const deleted = [true, false];
const devicetype = ["android", "ios"];
const emailnotification = [true, false];
const notification = [true, false];
const registertype = ['normal',"apple",'spotify'];

var UserSchema = new Schema({
  full_name: { type: String, default: '' },
  username: { type: String, default: '' },
  social_username: { type: String, default: '' },
  phone: { type: String, default: '' },
  role: { type: Schema.Types.ObjectId, ref: 'Role' },
  email: { type: String, default: '' },
  password: { type: String, default: '' },
  profile_image: { type: String, default: '' },
  location: { type: String, default: '' },
  social_id: { type: String, default: '' },
  register_type: { type: String, default: 'normal', enum: registertype },
  feature_song:[],
  isActivity: { type: Boolean, default: false, enum: [true, false] },
  badge_count: { type: Number, default:0,},
  isDeleted: { type: Boolean, default: false, enum: deleted },
  deviceToken: { type: String, default: '' },
  deviceType: { type: String, default: 'android', enum: devicetype },
  isActive: { type: Boolean, default: true, enum: [true, false] },
}, { timestamps: true, versionKey: false });

// generating a hash
UserSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function (password, checkPassword) {
  return bcrypt.compareSync(password, checkPassword);
  //bcrypt.compare(jsonData.password, result[0].pass
};

// For pagination
UserSchema.plugin(mongooseAggregatePaginate);

// create the model for users and expose it to our app
module.exports = mongoose.model('User', UserSchema);