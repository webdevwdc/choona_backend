const mongoose = require('mongoose');
const userModel = mongoose.model('User'); 

//email checking
exports.isEmailAvailable = function(email) {
	let emailAvailable = userModel.findOne({email:email});
	if(emailAvailable){
		return true;
	}else{
		return false;
	}
};