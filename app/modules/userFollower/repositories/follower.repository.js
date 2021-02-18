const mongoose = require('mongoose');
const userFollower = require('userFollower/models/user_follow.model');
const User = require('user/models/user.model');
const perPage = config.PAGINATION_PERPAGE;
var moment = require('moment');

const userFollowerRepository = {


    followerList: async (req) => {
        try {
            var conditions = {};
            var and_clauses = [];

            and_clauses.push({"follower_id": mongoose.Types.ObjectId(req.query.id)});

            if (_.isObject(req.body.query) && _.has(req.body.query, 'generalSearch')) {
                and_clauses.push({
                    $or: [
                        { 'full_name': { $regex: req.body.query.generalSearch, $options: 'i' } },
                        { 'username': { $regex: req.body.query.generalSearch, $options: 'i' } },
                        { 'email': { $regex: req.body.query.generalSearch, $options: 'i' } }
                    ]
                });
            }
            if (_.isObject(req.body.query) && _.has(req.body.query, 'Status')) {
                if(req.body.query.Status == 'Active'){
                    and_clauses.push({ "isActive": true });
                }else if(req.body.query.Status == 'Inactive'){
                    and_clauses.push({ "isActive": false });
                }else{
                    and_clauses.push({ "isActive": req.body.query.Status });
                }
            }
            conditions['$and'] = and_clauses;

            var sortOperator = { "$sort": {} };
            if (_.has(req.body, 'sort')) {
                var sortField = req.body.sort.field;
                if (req.body.sort.sort == 'desc') {
                    var sortOrder = -1;
                } else if (req.body.sort.sort == 'asc') {
                    var sortOrder = 1;
                }

                sortOperator["$sort"][sortField] = sortOrder;
            } else {
                sortOperator["$sort"]['_id'] = -1;
            }
            let follower = userFollower.aggregate([
                { "$lookup": {
                    "from": "users",
                    "localField": "follower_id",
                    "foreignField": "_id",
                    "as": "followers"
                    }
                },
                { "$unwind": "$followers" },
                {
                    "$group":{
                        '_id':"$_id",
                        'full_name':{$first:"$followers.full_name"},
                        'profile_image':{$first:"$followers.profile_image"},
                        'username':{$first:"$followers.username"},
                        'email':{$first:"$followers.email"},
                        'isActive':{$first:"$followers.isActive"},
                        'follower_id':{$first:"$followers._id"}
                    }
                },
                {$match:conditions},
                sortOperator

            ]);
            if (!follower) {
                return null;
            }
            var options = { page: req.body.pagination.page, limit: req.body.pagination.perpage };
            let allFollowers = await userFollower.aggregatePaginate(follower, options);
            return allFollowers;

        } catch (e) {
            return e;
        }
    },

    followinglist: async (req) => {
        try {
            var conditions = {};
            var and_clauses = [];

            and_clauses.push({"user_id": mongoose.Types.ObjectId(req.query.id)});

            if (_.isObject(req.body.query) && _.has(req.body.query, 'generalSearch')) {
                and_clauses.push({
                    $or: [
                        { 'full_name': { $regex: req.body.query.generalSearch, $options: 'i' } },
                        { 'username': { $regex: req.body.query.generalSearch, $options: 'i' } },
                        { 'email': { $regex: req.body.query.generalSearch, $options: 'i' } }
                    ]
                });
            }
            if (_.isObject(req.body.query) && _.has(req.body.query, 'Status')) {
                if(req.body.query.Status == 'Active'){
                    and_clauses.push({ "isActive": true });
                }else if(req.body.query.Status == 'Inactive'){
                    and_clauses.push({ "isActive": false });
                }else{
                    and_clauses.push({ "isActive": req.body.query.Status });
                }
                
            }
            conditions['$and'] = and_clauses;

            var sortOperator = { "$sort": {} };
            if (_.has(req.body, 'sort')) {
                var sortField = req.body.sort.field;
                if (req.body.sort.sort == 'desc') {
                    var sortOrder = -1;
                } else if (req.body.sort.sort == 'asc') {
                    var sortOrder = 1;
                }

                sortOperator["$sort"][sortField] = sortOrder;
            } else {
                sortOperator["$sort"]['_id'] = -1;
            }
            let following = userFollower.aggregate([
                { "$lookup": {
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "_id",
                    "as": "following"
                    }
                },
                { "$unwind": "$following" },
                {
                    "$group":{
                        '_id':"$_id",
                        'full_name':{$first:"$following.full_name"},
                        'profile_image':{$first:"$following.profile_image"},
                        'username':{$first:"$following.username"},
                        'email':{$first:"$following.email"},
                        'isActive':{$first:"$following.isActive"},
                        'user_id':{$first:"$following._id"}
                    }
                },
                {$match:conditions},
                sortOperator

            ]);
            if (!following) {
                return null;
            }
            var options = { page: req.body.pagination.page, limit: req.body.pagination.perpage };
            let allFollowing = await userFollower.aggregatePaginate(following, options);
            return allFollowing;

        } catch (e) {
            return e;
        }
    },

    getById: async (id) => {
        try {
            let follower = await userFollower.findById(id).exec();
            if (!follower) {
                return null;
            }
            return user;

        } catch (e) {
            return e;
        }
    },

    getByField: async (params) => {

        try {
            let follower = await userFollower.findOne(params).exec();
            if (!follower) {
                return null;
            }
            return follower;

        } catch (e) {
            return e;
        }
    },

    getAllByField: async (params) => {
        try {
            let follower = await userFollower.find(params).exec();
            if (!follower) {
                return null;
            }
            return follower;

        } catch (e) {
            return e;
        }
    },

    

    delete: async (id) => {
        try {
            let follower = await userFollower.findById(id);
            if (follower) {
                let followerDelete = await userFollower.remove({_id: id}).exec();
                if (!followerDelete) {
                    return null;
                }
                return followerDelete;
            }
        } catch (e) {
            return e;
        }
    },

    deleteByField: async (field, fieldValue) => {
        //todo: Implement delete by field
    },


   
   

    save: async (data) => {
        try {
            let follower = await userFollower.create(data);
            if (!follower) {
                return null;
            }
            return follower;
        } catch (e) {
            return e;
        }
    },

    followinglistApi: async (param) => {
        try {
          
            let following = await userFollower.aggregate([
                {$match:param},
                { "$lookup": {
                    "from": "users",
                    "localField": "follower_id",
                    "foreignField": "_id",
                    "as": "following"
                    }
                },
                { "$unwind": "$following" },
                {
                    "$group":{
                        '_id':"$_id",
                        'full_name':{$first:"$following.full_name"},
                        'profile_image':{$first:"$following.profile_image"},
                        'username':{$first:"$following.username"},
                        'email':{$first:"$following.email"},
                        'isActive':{$first:"$following.isActive"},
                        'user_id':{$first:"$following._id"},
                        'follower_id':{$first:"$follower_id"}
                    }
                },
            ]).sort({'full_name':1});
            if (!following) {
                return null;
            }
          
            return following;

        } catch (e) {
            return e;
        }
    },

    followerlistApi: async (param) => {
        try {

            let follower = await userFollower.aggregate([
                {$match:param},
                { "$lookup": {
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "_id",
                    "as": "followers"
                    }
                },
                { "$unwind": "$followers" },
                {
                    "$group":{
                        '_id':"$_id",
                        'full_name':{$first:"$followers.full_name"},
                        'profile_image':{$first:"$followers.profile_image"},
                        'username':{$first:"$followers.username"},
                        'email':{$first:"$followers.email"},
                        'isActive':{$first:"$followers.isActive"},
                        'follower_id':{$first:"$followers._id"},
                        'user_id':{$first:"$user_id"}
                    }
                },
                
             

            ]).sort({'full_name':1});
            if (!follower) {
                return null;
            }

            
          
            return follower;

        } catch (e) {
            return e;
        }
    },

    userWithTopFollowersApi: async (req) => {
        try {
          
            let following = await User.aggregate([
                {$match:{'isActive':true,'isDeleted':false}},
                { "$lookup": {
                    "from": "user_followers",
                    "localField": "_id",
                    "foreignField": "follower_id",
                    "as": "followers"
                    }
                },
                { "$unwind": "$followers" },
                {
                    "$group":{
                        '_id':"$_id",
                        "full_name":{$first:"$full_name"},
                        "username":{$first:"$username"},
                        "profile_image":{$first:"$profile_image"},
                        'followers':{$addToSet:"$followers"},
                        'isActive':{$first:"$isActive"},
                        'isDeleted':{$first:"$isDeleted"},
                        
                    }
                },
                {
                    $addFields:{'topFollwersCount': {$size:"$followers"}}
                },
                {$limit:5},
            ]).sort({'topFollwersCount':-1});

            if (!following) {
                return null;
            }
            
            return following;

        } catch (e) {
            
            return e;
        }
    },

    getByFieldId: async (params) => {

        try {
            let datas = [params.user_id];
           
            let follower = await userFollower.find(params);

            if (!follower) {
                return datas;
            }
           
            follower.map(data=>{
                datas.push(data.follower_id);
            });
            
            return datas;

        } catch (e) {
            return e;
        }
    },


};

module.exports = userFollowerRepository;