const mongoose = require("mongoose");
const follwerRepo = require('userFollower/repositories/follower.repository');
const activityRepo = require('activity/repositories/activity.repository');
const userRepo = require("user/repositories/user.repository");
const express = require("express");
const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);
const querystring = require("querystring");
/*for push notification*/
var push = require('push/controllers/push.controller.js');
var FCM = require('fcm-push');
var apn = require('apn');
var serverKey = config.android_serverKey;
var fcm = new FCM(serverKey);
/*end section*/




// var geocoder = NodeGeocoder(options);

class userFollowerController {
	constructor() { }

    /* 
    // @Method: followUnfollow
    // @Description: follow and unfollow a user
    */
	async followUnfollow(req) {
		try {
          
			const follower = await follwerRepo.getByField({'user_id':req.user._id,'follower_id':req.body.follower_id});
			if (!_.isEmpty(follower)) {
                const followerRemoved = await follwerRepo.delete({'_id':mongoose.Types.ObjectId(follower._id)});
				return { status: 200, data: followerRemoved, message: 'Removed follower.' };
			}else {
                const savefollower = await follwerRepo.save({'user_id':req.user._id,'follower_id':req.body.follower_id});
				await activityRepo.save({'from_user_id':req.user._id,'to_user_id':req.body.follower_id,'activity_type':'following'});
				/*sending push start*/
					let user = await userRepo.getById(req.body.follower_id);
                    let fromUser= await userRepo.getById(req.user._id);
                    var device_token =user.deviceToken;
                    var device_type =user.deviceType;
            
                    if(device_token!='' && device_type!=''){
                        var to = user._id;
                        var from = '';
                        var contentAvailable = false;
                        var badge = parseInt(user.badge_count) + parseInt(1);
                        const type = 'followUser';
                        var title = fromUser.full_name +" is now follwing you";
                        var params ={"type":"followUser","text":"A new user is follwoing you."};
                        let server = push.sendPush("followUserActivity", device_type, device_token, title,params,from,to,type,badge,contentAvailable);
                    }
				/*end push section*/
				await userRepo.updateById({isActivity:true},mongoose.Types.ObjectId(req.body.follower_id));
				return { status: 201, data:savefollower, message: 'You have follwed this user successfully.' };
			}
		}catch (e) {
			
			return { status: 500, data: [], message: e.message };
		}
    }
    
    /* 
    // @Method: followerList
    // @Description: follower list
    */
	async followerList(req) {
		try {
		
			if(!_.isEmpty(req.query.user_id)){
				var follower = await follwerRepo.followerlistApi({'follower_id':mongoose.Types.ObjectId(req.query.user_id)});
			}else{
				var follower = await follwerRepo.followerlistApi({'follower_id':req.user._id});
			}

			
			if (!_.isEmpty(follower)) {
				let searchData = [];
				const start = async () => {
                    await asyncForEach(follower, async (user) => {
	                 	const following = await follwerRepo.getByField({'user_id':req.user._id,'follower_id':mongoose.Types.ObjectId(user.user_id)});
	                 	
						if(!_.isEmpty(following)){
							searchData.push({
												full_name:user.full_name,
												username:user.username,
												profile_image:user.profile_image,
												_id:user.user_id,
												isFollowing:true
											});
						}else{
							searchData.push({
												full_name:user.full_name,
												username:user.username,
												profile_image:user.profile_image,
												_id:user.user_id,
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
				//return { status: 200, data: follower, message: 'Your follower list fetched successfully.' };
			}else {
				return { status: 201, data:[], message: 'no data found.' };
			}
		}catch (e) {
			return { status: 500, data: [], message: e.message };
		}
    }
    
    /* 
    // @Method: followingList
    // @Description: following List
    */
	async followingList(req) {
		try {
			if(!_.isEmpty(req.query.user_id)){
				var following = await follwerRepo.followinglistApi({'user_id':mongoose.Types.ObjectId(req.query.user_id)});
			}else{
				var following = await follwerRepo.followinglistApi({'user_id':req.user._id});
			}
			
			if (!_.isEmpty(following)) {
				let searchData = [];
				const start = async () => {
                    await asyncForEach(following, async (user) => {
	                 	const following = await follwerRepo.getByField({'user_id':req.user._id,'follower_id':mongoose.Types.ObjectId(user.user_id)});
	                 	
						if(!_.isEmpty(following)){
							searchData.push({
												full_name:user.full_name,
												username:user.username,
												profile_image:user.profile_image,
												_id:user.user_id,
												isFollowing:true
											});
						}else{
							searchData.push({
												full_name:user.full_name,
												username:user.username,
												profile_image:user.profile_image,
												_id:user.user_id,
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
				//return { status: 200, data: following, message: 'Your following list fetched successfully.' };
			}else {
				return { status: 201, data:[], message: 'no data found.' };
			}
		}catch (e) {
			
			return { status: 500, data: [], message: e.message };
		}
	}


	async topFollowers(req) {
		try{
			var topFollower = await follwerRepo.userWithTopFollowersApi(req);
			if (!_.isEmpty(topFollower)) {
                
				return { status: 200, data: topFollower, message: 'Top Follower list fetched successfully.' };
			}else {
                
				return { status: 201, data:[], message: 'Data not found.' };
			}
		}catch(e){
			console.log(e)
		}
	}


	
}

module.exports = new userFollowerController();
