const mongoose = require("mongoose");
const activityRepo = require('activity/repositories/activity.repository');
const follwerRepo = require('userFollower/repositories/follower.repository');
const express = require("express");
const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);
const querystring = require("querystring");
const moment = require('moment');


class activityController {
	constructor() { }
    
    /* 
    // @Method: activityList
    // @Description: follower list
    */
	async activityList(req) {
		try {
			//fetch activity of last 2 week
			let week = moment().subtract(2, 'weeks').format('YYYY-MM-DD');
			const activities = await activityRepo.list({'date': { $gte: week },'to_user_id':req.user._id});
			if (!_.isEmpty(activities)) {
				let searchData = [];
				const start = async () => {
                    await asyncForEach(activities, async (user) => {

	                 	const following = await follwerRepo.getByField({'user_id':req.user._id,'follower_id':mongoose.Types.ObjectId(user.from_user_id)});
	                 	
						if(!_.isEmpty(following)){
							searchData.push({
												full_name:user.full_name,
												username:user.username,
												profile_image:user.profile_image,
												_id:user.user_id,
												isFollowing:true,
												activity_type:user.activity_type,
												createdAt:user.createdAt,
												text:user.text,
												image:user.image,
												post_id:user.post_id,
											});
						}else{
							searchData.push({
												full_name:user.full_name,
												username:user.username,
												profile_image:user.profile_image,
												_id:user.user_id,
												isFollowing:false,
												activity_type:user.activity_type,
												createdAt:user.createdAt,
												text:user.text,
												image:user.image,
												post_id:user.post_id,
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
				return { status: 200, data: activities, message: 'Your activities fetched successfully.' };
			}else {
				return { status: 201, data:[], message: 'no data found.' };
			}
		}catch (e) {
			return { status: 500, data: [], message: e.message };
		}
    }
    
    
	
}

module.exports = new activityController();
