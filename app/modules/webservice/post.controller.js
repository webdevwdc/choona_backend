const mongoose = require("mongoose");
var ObjectID = require('mongodb').ObjectID;
const postRepo = require('post/repositories/post.repository');
const follwerRepo = require('userFollower/repositories/follower.repository');
const activityRepo = require('activity/repositories/activity.repository');
const userRepo = require("user/repositories/user.repository");
const express = require("express");
const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);
const querystring = require("querystring");
const moment = require('moment');



/*for push notification*/
var push = require('push/controllers/push.controller.js');
var FCM = require('fcm-push');
var apn = require('apn');
var serverKey = config.android_serverKey;
var fcm = new FCM(serverKey);
/*end section*/




class postController {
	constructor() { }

	async store(req) {
		try {
			req.body.user_id = req.user._id
			const postStore = await postRepo.save(req.body);
			if (!_.isEmpty(postStore)) {
				return { status: 200, data: postStore, message: 'Your post saved successfully.' };
			}else {
				return { status: 201, data:[], message: 'Something went wrong.' };
			}
		}catch (e) {
			return { status: 500, data: [], message: e.message };
		}
	}

	async list(req) {
		try {

			let postPerPage = parseInt(10);
			let skip = parseInt(0);
			if(req.query.page){
				var page = parseInt((req.query.page?req.query.page:1));
			    skip = parseInt(postPerPage*(page-1));
			}else{
				var page=1;
			}
			
			let followersData = await follwerRepo.getByFieldId({user_id:req.user._id});
			
			//const postList = await postRepo.list({"isActive" :true},skip,postPerPage);
			if(!_.isEmpty(req.query) && !_.isEmpty(req.query.keyword)){ //for search
				//var query = {"isActive" :true,'song_name':{'$regex' :req.query.keyword.replace(/\\/g, ''), '$options' : 'i'}}
				//var query = {$or: [{"isActive" :true,'song_name':{'$regex' :decodeURI(req.query.keyword), '$options' : 'i'}},{"isActive" :true,'song_name':req.query.keyword.replace(/\\/g, '')}]}
				var query = {$or : [ 
						        {"song_name": {'$regex' :decodeURI(req.query.keyword), '$options' : 'i'}},
						        {"artist_name": {'$regex' :decodeURI(req.query.keyword), '$options' : 'i'}},
						    ],
						    
						    'isActive':true,       
						}
			}else{
				var query = {"isActive" :true,'user_id':{$in:followersData}}
			}



			const postList = await postRepo.list(query,skip,postPerPage);
			if (!_.isEmpty(postList)) {
				let searchData = [];

				
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

	   				    searchData.push(post);
	                });
                }
              	
               	
                await start();
                
                return { status: 200, data: postList,page:page, "message": "User list fetched successfully." };
                async function asyncForEach(array, callback) {
                    for (let index = 0; index < array.length; index++) {
                        await callback(array[index], index, array);
                    }
                }
				//return { status: 200, data: postList, message: 'Your post fetched successfully.' };
			}else {
				return { status: 201, data:[], message: 'No data found.' };
			}
		}catch (e) {
			return { status: 500, data: [], message: e.message };
		}
	}

	async comment(req) {
		try {
			

			let post = await postRepo.getById(mongoose.Types.ObjectId(req.body.post_id));
			if(!_.isEmpty(post)){
				let data = {
					'comment':{'user_id':req.user._id,
					'text':req.body.text,
					//'profile_image':req.user.profile_image,
					'username':req.user.username,
					 _id: new ObjectID(),
					 createdAt:moment().format(),
					},
				}

				let postUpdate = await postRepo.updateById({$push:data},post._id);
				if(!_.isEmpty(postUpdate)){
					//when i am commenting on my own post no activity will save
					if(req.user._id.toString() != post.user_id.toString() ){
						await activityRepo.save({'from_user_id':req.user._id,'to_user_id':post.user_id,'activity_type':'comment','text':req.body.text,'image':post.song_image,'post_id':post._id});
						await userRepo.updateById({isActivity:true},mongoose.Types.ObjectId(post.user_id));	
						/*sending push start*/
							let user = await userRepo.getById(post.user_id);
		                    let fromUser= await userRepo.getById(req.user._id);
		                    var device_token =user.deviceToken;
		                    var device_type =user.deviceType;
		            
		                    if(device_token!='' && device_type!=''){
		                        var to = user._id;
		                        var from = '';
		                        var badge = parseInt(user.badge_count) + parseInt(1);
		                        const type = 'postComment';
		                        var title = fromUser.full_name +" commented on your post: " + req.body.text;
		                        var params ={"type":"postComment","text":postUpdate.song_name +'-'+ postUpdate.artist_name };
		                        var contentAvailable = false;
		                        let server = push.sendPush("followUserActivity", device_type, device_token, title,params,from,to,type,badge,contentAvailable);
		                    }
						/*end push section*/
					}
					
					return { status: 200, data:postUpdate, message: 'Comment saved successfully.' };
				}else{
					return { status: 201, data:[], message: 'Something went wrong.' };
				}
			}else{
				return { status: 201, data:[], message: 'No post found.' };
			}
		}catch (e) {
			return { status: 500, data: [], message: e.message };
		}
	}

	async reaction(req) {
		try {

			let query = {
				'_id':mongoose.Types.ObjectId(req.body.post_id),
				reaction: { $elemMatch: {'user_id':req.user._id} }
			}

		

			let post = await postRepo.getByField(query);
			let data = {
					'reaction':{'user_id':req.user._id,
					'text':req.body.text,
					'text_match':req.body.text_match,
					'username':req.user.username,
					 _id: new ObjectID(),
					 createdAt:moment().format(),
					},
				}
			/*let postUpdate = await postRepo.updateById({$push:data},mongoose.Types.ObjectId(req.body.post_id));
		   
		    if(!_.isEmpty(postUpdate)){
				
				if(req.user._id.toString() != postUpdate.user_id.toString() ){
					await activityRepo.save({'from_user_id':req.user._id,'to_user_id':postUpdate.user_id,'activity_type':'reaction','text':req.body.text,'image':postUpdate.song_image,'post_id':postUpdate._id});
					await userRepo.updateById({isActivity:true},mongoose.Types.ObjectId(postUpdate.user_id));
					
						let user = await userRepo.getById(postUpdate.user_id);
	                    let fromUser= await userRepo.getById(req.user._id);
	                    var device_token =user.deviceToken;
	                    var device_type =user.deviceType;
	            
	                    if(device_token!='' && device_type!=''){
	                        var to = user._id;
	                        var from = '';
	                        var contentAvailable = false;
	                        var badge = parseInt(user.badge_count) + parseInt(1);
	                        const type = 'postReact';
	                        var title = fromUser.full_name +" reacted on your post: " + req.body.text;
	                        var params ={"type":"postReact","text":postUpdate.song_name +'-'+ postUpdate.artist_name};
	                        let server = push.sendPush("postReact", device_type, device_token, title,params,from,to,type,badge,contentAvailable);
	                    }
					
					return { status: 200, data:postUpdate, message: 'Reaction saved successfully.' };
				}else{
					return { status: 200, data:postUpdate, message: 'Reaction saved successfully.' };
				}
			}else{
				return { status: 201, data:[], message: 'Something went wrong.' };
			}*/
			if(!_.isEmpty(post)){
				let findPost = await postRepo.getByField({reaction: {$elemMatch: {'user_id': req.user._id,'text_match':req.body.text_match}}},mongoose.Types.ObjectId(req.body.post_id))
				
			    if(_.isEmpty(findPost)){
			    	let postUpdate = await postRepo.updateById({$push:data},mongoose.Types.ObjectId(req.body.post_id));
			    	await activityRepo.save({post_id:postUpdate._id,'from_user_id':req.user._id,'to_user_id':postUpdate.user_id,'activity_type':'reaction','text':req.body.text,'image':postUpdate.song_image});
			    	return { status: 201, data:postUpdate, message: 'Reaction added.' };
			    }else{
			    	let updatePost = await postRepo.updateById({$pull: {reaction: {'user_id': req.user._id,'text_match':req.body.text_match}}},mongoose.Types.ObjectId(req.body.post_id))
					return { status: 201, data:updatePost, message: 'Reaction Removed.' };
			    }
			}else{
				let postUpdate = await postRepo.updateById({$push:data},req.body.post_id);
				
				if(!_.isEmpty(postUpdate)){
					
					if(req.user._id.toString() != postUpdate.user_id.toString() ){
						
					    await userRepo.updateById({isActivity:true},mongoose.Types.ObjectId(postUpdate.user_id));
					
						let user = await userRepo.getById(postUpdate.user_id);
	                    let fromUser= await userRepo.getById(req.user._id);
	                    var device_token =user.deviceToken;
	                    var device_type =user.deviceType;
	            
	                    if(device_token!='' && device_type!=''){
	                        var to = user._id;
	                        var from = '';
	                        var contentAvailable = false;
	                        var badge = parseInt(user.badge_count) + parseInt(1);
	                        const type = 'postReact';
	                        var title = fromUser.full_name +" reacted on your post: " + req.body.text;
	                        var params ={"type":"postReact","text":postUpdate.song_name +'-'+ postUpdate.artist_name};
	                        let server = push.sendPush("postReact", device_type, device_token, title,params,from,to,type,badge,contentAvailable);
	                    }
						await activityRepo.save({post_id:postUpdate._id,'from_user_id':req.user._id,'to_user_id':postUpdate.user_id,'activity_type':'reaction','text':req.body.text,'image':postUpdate.song_image});
						return { status: 200, data:postUpdate, message: 'Reaction saved successfully.' };
					}else{
						return { status: 200, data:postUpdate, message: 'Reaction saved successfully.' };
					}
				}else{
					return { status: 201, data:[], message: 'Something went wrong.' };
				}
			}
			
		}catch (e) {
			
			return { status: 500, data: [], message: e.message };
		}
	}

	async delete(req) {
		try {
			
			const postDelete = await postRepo.delete({_id:mongoose.Types.ObjectId(req.params.id),user_id:req.user._id});
			if (!_.isEmpty(postDelete)) {
				return { status: 200, data: postDelete, message: 'Your post is deleted successfully.' };
			}else {
				return { status: 201, data:[], message: 'No post found.' };
			}
		}catch (e) {
			return { status: 500, data: [], message: e.message };
		}
	}

	async topFifty(req) {
		try {
			var currentDate = moment().format("YYYY-MM-DD");

			const postList = await postRepo.topFiftyApi({date:currentDate});
			if (!_.isEmpty(postList)) {
				return { status: 200, data: postList, message: 'Top 50 post fetched successfully.' };
			}else {
				return { status: 201, data:[], message: 'No post found.' };
			}
		}catch (e) {
			
			return { status: 500, data: [], message: e.message };
		}
	}


	async details(req) {
		try {
			
			const post = await postRepo.getById(req.params.id);
			if (!_.isEmpty(post)) {
				let searchData = [];
				const start = async () => {
                    	
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

	   				    searchData.push(post);
	               
                }
              	
               	
                await start();
                
                return { status: 200, data: post, "message": "User list fetched successfully." };
                async function asyncForEach(array, callback) {
                    for (let index = 0; index < array.length; index++) {
                        await callback(array[index], index, array);
                    }
                }
				return { status: 200, data: post, message: 'Your post saved successfully.' };
			}else {
				return { status: 201, data:[], message: 'Something went wrong.' };
			}
		}catch (e) {
			return { status: 500, data: [], message: e.message };
		}
	}

	

	
}

module.exports = new postController();
