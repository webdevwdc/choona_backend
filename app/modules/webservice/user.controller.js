const mongoose = require("mongoose");

const userRepo = require("user/repositories/user.repository");
const roleRepo = require("role/repositories/role.repository");
const follwerRepo = require('userFollower/repositories/follower.repository');
const postRepo = require('post/repositories/post.repository');

const userModel = require("user/models/user.model.js");
const express = require("express");
const routeLabel = require("route-label");
const helper = require("../../helper/helper.js");
const mailer = require("../../helper/mailer.js");
const router = express.Router();
const namedRouter = routeLabel(router);
const querystring = require("querystring");
const gm = require("gm").subClass({
	imageMagick: true
});
const fs = require("fs");
const bcrypt = require('bcrypt-nodejs');
const jwt = require("jsonwebtoken");

const User = new userModel();

//mail send
const { join } = require("path");
const ejs = require("ejs");
const { readFile } = require("fs");
const { promisify } = require("util");
const readFileAsync = promisify(readFile);

/*for push notification*/
var push = require('push/controllers/push.controller.js');
var FCM = require('fcm-push');
var apn = require('apn');
var serverKey = config.android_serverKey;
var fcm = new FCM(serverKey);
/*end section*/


class userController {
	constructor() { }

	/* @Method: signup @Description: User Signup */
	async signup(req, res) {
		try {
			
			let role = await roleRepo.getByField({ 'role': 'user' });
			req.body.role = role._id;

			/* user has username */
			if (!_.isEmpty(req.body.username)) {
				let checkUsername = await userRepo.getByField({ "username": req.body.username, "isDeleted": false });
				if (!_.isEmpty(checkUsername)) {
					return { status: 201, data: [], "message": 'Username already exists.' };
				}
			}
			//adding first charactr 0 and checking with number
			if(!_.isEmpty(req.body.phone)){
				let phoneAtFirst = req.body.phone.charAt(0);
				if(phoneAtFirst && phoneAtFirst==0){
					let checkPhone = await userRepo.getByField({ "phone": req.body.phone, "isDeleted": false });
					if (!_.isEmpty(checkPhone)) {
						return { status: 201, data: [], "message": 'Phone already exists.' };
					}else{
						req.body.phone = req.body.phone;
					}
				}else{
					
					let phoneAtFirst = parseInt(0)+req.body.phone;
					let checkPhone = await userRepo.getByField({ "phone": phoneAtFirst, "isDeleted": false });
					if (!_.isEmpty(checkPhone)) {
						return { status: 201, data: [], "message": 'Phone already exists.' };
					}else{
						req.body.phone = phoneAtFirst;
					}
					
				}
			}

			if (req.body.register_type && ( req.body.register_type == "spotify" || req.body.register_type == "apple")) {
				let checkSocial = await userRepo.getByField({ "social_id": req.body.social_id, "isDeleted": false });
				if (!_.isEmpty(checkSocial)) {
					return { status: 201, data: [], "message": 'User already exists.' };
				}
			}


			if (req.body.register_type && (req.body.register_type == "spotify" || req.body.register_type == "apple")) {
				req.body.social_id = req.body.social_id;
			}

			/* user has profile image */
			if (req.files.length > 0) {
                req.files.map(file => {
                    gm('./public/uploads/user/' + file.filename).resize(200, 200, '!')
                        .write('./public/uploads/user/thumb/' + file.filename, function (err, result) {
                            if (!err) console.log('done');
                        });
					req.body.profile_image = file.filename;
                });
            }
			
			//req.body.password = User.generateHash(req.body.password);


			let userData = await userRepo.save(req.body);
			const payload = { id: userData._id };
			const token = jwt.sign(payload, config.jwtSecret, { expiresIn: 31104000 });
			return { status: 200, data: userData, token: token, "message": 'Registration successful.' };
		}catch (e) {
			
			return { status: 500, "message": e.message };
		}
	}

	

	/* @Method: signin
	// @Description: User Login
	*/
	async signin(req, res) {
		try {

			if (_.has(req.body, 'social_id')) {
				if (req.body.social_type == "apple" || req.body.social_type == "spotify") {
					let checkUserData = await userRepo.getByField({"social_id": req.body.social_id,"isDeleted": false});
					if (!_.isEmpty(checkUserData)) {
						let roleInfo = await roleRepo.getById(checkUserData.role)
						if (roleInfo.role == "user") {
							if (checkUserData.isActive && checkUserData.isActive === true) {
								var updateObj = { "deviceToken":req.body.deviceToken, "deviceType": req.body.deviceType };
								const updatedObj = await userRepo.updateById(updateObj, checkUserData._id);
								const payload = {id: checkUserData._id};
								//const token = jwt.sign(payload, config.jwtSecret, {expiresIn: 2592000});
								const token = jwt.sign(payload, config.jwtSecret, {expiresIn: 31104000});

								return { status: 200, data: checkUserData, isLoggedIn: true, token: token, "message": 'Login successful.' };
							}
							else {
								return { status: 201, data: [], isLoggedIn: false, "message": 'User status is inactive.' };
							}
						}
						else {
							return { status: 201, data: [], isLoggedIn: false, "message": 'Sorry user not found.' };
						}
					}else {
						return { status: 201, data: [], isLoggedIn: false, "message": 'User not found.' };
					}
				}else{
					return { status: 201, data: [], isLoggedIn: false, "message": 'Social type not found..' };
				}
			}else{
				return { status: 201, data: [], isLoggedIn: false, "message": 'Something went wrong.' };
			}
			
		}catch (e) {
            return res.status(500).send({status: 500,message: e.message});
		}
	}


	/* @Method: forgotPassword
	// @Description: To forgotPassword
	*/
	async forgotPassword(req, res) {
		try {

			const user = await userRepo.getByField({
				email: req.body.email
			});

			if (!_.isEmpty(user)) {
				let verification_code = randomInt(1000, 9999);

				const setting_data = await settingRepo.getAllByField({
					"isDeleted": false
				});
				var settingObj = {};
				if (!_.isEmpty(setting_data)) {
					setting_data.forEach(function (element) {
						settingObj[element.setting_name.replace(/\s+/g, "_")] = element.setting_value;
					});
				}
				let locals = {
					user_fullname: user.full_name,
					verification_code: verification_code,
					site_title: 'Choona'//settingObj.Site_Title
				};
				let isMailSend = await mailer.sendMail(`Admin<${process.env.MAIL_USERNAME}>`, req.body.email, 'Verification Code', 'forgot-password', locals);
				if (isMailSend) {
					await userRepo.updateById({
						verification_code: verification_code
					}, user._id);
					return { status: 200, data: [], "message": 'A verification code to reset your password sent to your registered email' };
				}
			}else {
				return { status: 201, data: [], message: 'No matching user found' };
			}
		}
		catch (e) {
			return { status: 500, data: [], message: e.message };
		}
	}


	/* @Method: logout
	// @Description: To logout user
	*/
	async logout(req, res) {
		try {
			var user_id = req.user._id;
			const result = await userRepo.getById(user_id);
			if (!_.isEmpty(result)) {
				var updateObj = { "deviceToken": "", "deviceType": "" };
				const updatedObj = await userRepo.updateById(updateObj, user_id);
				const payload = { id: user_id };
				const token = jwt.sign(payload, config.jwtSecret, { expiresIn: 0 });
				//jwt.destroy(token)
				return { status: 200, data: [], isLoggedIn: false, "message": 'Logout successfully' };
			}else {
				return { status: 201, data: [], "message": 'No user found' };
			}
		}catch (e) {
			return res.status(500).send({ "message": e.message });
		}
	}



  
	async getMyProfile(req) {
		try {
			const user = await userRepo.getById(req.user._id);
			const follower = await follwerRepo.getAllByField({'follower_id':req.user._id});
			const following = await follwerRepo.getAllByField({'user_id':req.user._id});
			if (!_.isEmpty(user)) {
				user['follower'] = follower.length;
				user['following'] = following.length;
				let myPosts = [];
				//let profile = await postRepo.getAllByField({user_id:req.user._id,'isActive':true});
				let postList = await postRepo.list({user_id:req.user._id,'isActive':true});
				const start = async () => {
                    await asyncForEach(postList, async (post) => {
                    	
                    	//reaction array
	                 	await asyncForEach(post.reaction, async (reaction) => {
		                 	let following = await follwerRepo.getByField({user_id:req.user._id,'follower_id':reaction.user_id});
		                 	let userImage = await userRepo.getByField({_id:reaction.user_id});
		                 	
		                 	if(!_.isEmpty(following)){
		                 		var followerPost = await postRepo.list({"isActive" :true,'user_id':following.follower_id});
		                 		
		                 		reaction.isFollowing = true;
		                 		reaction.profile_image = userImage.profile_image;
		                 	}else{
		                 		reaction.isFollowing = false;
		                 		reaction.profile_image = userImage.profile_image;
		                 	}
		                });
		                //for comment
		                await asyncForEach(post.comment, async (comment) => {
		                 	let userImage = await userRepo.getByField({_id:comment.user_id});
		                 	if(!_.isEmpty(userImage)){
		                 		comment.profile_image = userImage.profile_image;
		                 	}
		                });

	   				    myPosts.push(post);
	                });
                }
              	
               	user['post'] = myPosts;
                await start();
                
                return { status: 200, data: user, "message": "User list fetched successfully." };
                async function asyncForEach(array, callback) {
                    for (let index = 0; index < array.length; index++) {
                        await callback(array[index], index, array);
                    }
                }
				
				
			}else {
				return { status: 201, data: [], message: 'User not found' };
			}
		}catch (e) {
			return { status: 500, data: [], message: e.message };
		}
	}

	async getUserProfile(req) {
		try {
			const user = await userRepo.getById(req.params.id);
			if (!_.isEmpty(user)) {
				const follower = await follwerRepo.getAllByField({'follower_id':req.params.id});
				const following = await follwerRepo.getAllByField({'user_id':req.params.id});
			    user['follower'] = follower.length;
				user['following'] = following.length;
				let postList = await postRepo.list({user_id:mongoose.Types.ObjectId(req.params.id),'isActive':true});
				
				const followingData = await follwerRepo.getByField({'user_id':req.user._id,'follower_id':mongoose
					.Types.ObjectId(req.params.id)});
				if(!_.isEmpty(followingData)){
					user['isFollowing'] = true;
				}else{
					user['isFollowing'] = false;
				}
				let myPosts = [];
				const start = async () => {
                    await asyncForEach(postList, async (post) => {
                    	
                    	//reaction array
	                 	await asyncForEach(post.reaction, async (reaction) => {
		                 	let following = await follwerRepo.getByField({user_id:req.params.id,'follower_id':reaction.user_id});
		                 	let userImage = await userRepo.getByField({_id:reaction.user_id});
		                 	
		                 	if(!_.isEmpty(following)){
		                 		var followerPost = await postRepo.list({"isActive" :true,'user_id':following.follower_id});
		                 		
		                 		reaction.isFollowing = true;
		                 		reaction.profile_image = userImage.profile_image;
		                 	}else{
		                 		reaction.isFollowing = false;
		                 		reaction.profile_image = userImage.profile_image;
		                 	}
		                });
		                //for comment
		                await asyncForEach(post.comment, async (comment) => {
		                 	let userImage = await userRepo.getByField({_id:comment.user_id});
		                 	if(!_.isEmpty(userImage)){
		                 		comment.profile_image = userImage.profile_image;
		                 	}
		                });

	   				    myPosts.push(post);
	                });
                }
              	
               	user['post'] = myPosts;
                await start();
                
                return { status: 200, data: user, "message": "User profile fetched successfully." };
                async function asyncForEach(array, callback) {
                    for (let index = 0; index < array.length; index++) {
                        await callback(array[index], index, array);
                    }
                }
				
			}else {
				return { status: 201, data: [], message: 'User not found' };
			}
		}catch (e) {
			return { status: 500, data: [], message: e.message };
		}
	}


	async updateProfile(req) {
		try {
		
			const data = await userRepo.getById(req.user._id);

			if (!_.isEmpty(data.email)) {
				if (_.has(req.body, 'email') && (data.email != req.body.email)) {
					const result = await userRepo.getByField({ 'email': req.body.email, 'isDeleted': false });
					if (!_.isEmpty(result)) {
						return { status: 201, data: {}, "message": "This email address is already exist!" };
					}
				}else {
					if (_.has(req, 'files')) {
						if (req.files.length > 0) {
							if (!_.isEmpty(data)) {
								if (!_.isEmpty(data) && data.profile_image != '') {
									if (fs.existsSync('public/uploads/user/' + data.profile_image)) {
										const upl_resume = fs.unlinkSync('public/uploads/user/' + data.profile_image);
									}
									if (fs.existsSync('public/uploads/user/thumb/' + data.profile_image)) {
										const upl_thumb_resume = fs.unlinkSync('public/uploads/user/thumb/' + data.profile_image);
									}
								}
							}
							gm('public/uploads/user/' + req.files[0].filename).resize(100).write('public/uploads/user/thumb/' + req.files[0].filename, function (err) {
								if (err) throw new Error(err.message);
							});
							req.body.profile_image = req.files[0].filename;
						}
					}else {
						req.body.profile_image = data.profile_image;
					}
				}

				if(!_.isEmpty(req.body.phone)){
					let phoneAtFirst = req.body.phone.charAt(0);
					if(phoneAtFirst && phoneAtFirst==0){
						let checkPhone = await userRepo.getByField({ "phone": req.body.phone, "isDeleted": false,_id: { $ne: mongoose.Types.ObjectId(req.user._id) } });
						if (!_.isEmpty(checkPhone)) {
							return { status: 201, data: [], "message": 'Phone already exists.' };
						}else{
							req.body.phone = req.body.phone;
						}
					}else{
						
						let phoneAtFirst = parseInt(0)+req.body.phone;
						let checkPhone = await userRepo.getByField({ "phone": phoneAtFirst, "isDeleted": false,_id: { $ne: mongoose.Types.ObjectId(req.user._id) } });
						if (!_.isEmpty(checkPhone)) {
							return { status: 201, data: [], "message": 'Phone already exists.' };
						}else{
							req.body.phone = phoneAtFirst;
						}
						
					}
				}
				const result2 = await userRepo.updateById(req.body, req.user._id);
				if(!_.isEmpty(req.body.badge_count)){
					/*sending push start*/
					
                    var device_token =result2.deviceToken;
                    var device_type =result2.deviceType;
            
                    if(device_token!='' && device_type!=''){
                        var to = result2._id;
                        var from = '';
                        var badge =0;
                        const type = '';
                        var title = "";
                        var params ={};
                        var contentAvailable =true;
                        if(device_type=='ios'){
                        	let server = push.sendPush("", device_type, device_token, title,params,from,to,type,badge,contentAvailable);
                        }
                        
                    }
				/*end push section*/
				}
				return { status: 200, data: result2, "message": "User details updated successfully" };
			}else {
				return { status: 200, data: [], "message": "User not found" };
			}
		}catch (e) {
			return res.status(500).send({ status: 500, message: e.message });
		}
	}

	async searchUser(req) {
		try{
			
			let role = await roleRepo.getByField({ 'role': 'admin' });
			let query = {
							_id:{$ne:req.user._id},
							'role':{$ne:role._id},
							'isDeleted':false,
							'isActive':true,
							username:{'$regex' :req.body.keyword, '$options' : 'i'},
						}
			const data = await userRepo.getAllByField(query);
			
			let searchData = [];
			if(!_.isEmpty(data)){
				
				const start = async () => {
                    await asyncForEach(data, async (user) => {
	                 	const follower = await follwerRepo.getByField({'user_id':req.user._id,'follower_id':mongoose.Types.ObjectId(user._id)});
	                 
						if(!_.isEmpty(follower)){
							searchData.push({
												full_name:user.full_name,
												username:user.username,
												profile_image:user.profile_image,
												_id:user._id,
												isFollowing:true
											});
						}else{
							searchData.push({
												full_name:user.full_name,
												username:user.username,
												profile_image:user.profile_image,
												_id:user._id,
												isFollowing:false
											});
						}
	                   
	                });
                }
              
               
                await start();
                return { status: 200, data: searchData, "message": "User list fetched successfully." };
                async function asyncForEach(array, callback) {
                    for (let index = 0; index < array.length; index++) {
                        await callback(array[index], index, array);
                    }
                }
            }else{
            	return { status: 200, data:[], "message": "No data found." };
            }
			
		}catch(e){
			return {
                status: 500,
                data: {},
                "message": e.message
            };
		}
	}

	async usernameAvailable(req, res) {
        try {
         
            let usernameAvailable = await userRepo.getByField({
                'username': req.body.username
            });
            if (!_.isEmpty(usernameAvailable)) {
                return {
                    status: 201,
                    data: usernameAvailable,
                    message: 'Username already exists. Please choose another username.'
                }
            } else {
                return {
                    status: 200,
                    data: [],
                    message: 'You can use this username.'
                }
            }
        } catch (e) {
            return {
                status: 500,
                data: {},
                "message": e.message
            };
        }


    }

    async searchPhone(req) {
		try{
			
			let role = await roleRepo.getByField({ 'role': 'admin' });
			let query = {
							_id:{$ne:req.user._id},
							'role':{$ne:role._id},
							'isDeleted':false,
							'isActive':true,
							phone:{$in:req.body.phone},
						}
						
			const data = await userRepo.getAllByField(query);
			let searchData = [];
			if(!_.isEmpty(data)){
				
				const start = async () => {
                    await asyncForEach(data, async (user) => {
	                 	const follower = await follwerRepo.getByField({'user_id':req.user._id,'follower_id':mongoose.Types.ObjectId(user._id)});
	                 
						if(!_.isEmpty(follower)){
							searchData.push({
												full_name:user.full_name,
												username:user.username,
												profile_image:user.profile_image,
												_id:user._id,
												isFollowing:true
											});
						}else{
							searchData.push({
												full_name:user.full_name,
												username:user.username,
												profile_image:user.profile_image,
												_id:user._id,
												isFollowing:false
											});
						}
	                   
	                });
                }
              
               
                await start();

                return { status: 200, data: searchData, "message": "User list fetched successfully." };
                async function asyncForEach(array, callback) {
                    for (let index = 0; index < array.length; index++) {
                        await callback(array[index], index, array);
                    }
                }
            }else{
            	return { status: 201, data:[], "message": "No data found." };
            }
		}catch(e){
			return {
                status: 500,
                data: {},
                "message": e.message
            };
		}
	}


	
}

module.exports = new userController();
