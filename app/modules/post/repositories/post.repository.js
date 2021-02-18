const mongoose = require('mongoose');
const Post = require('post/models/post.model');
const perPage = config.PAGINATION_PERPAGE;
var moment = require('moment');

const postRepository = {
    list:async(query,skip,limit)=>{
       if(_.isUndefined(limit)) limit = 10;
       if(_.isUndefined(skip)) skip = parseInt(skip);
       if(_.isNaN(skip)) skip = parseInt(skip);
       
        let aggregate = await Post.aggregate([
            {$match:query},
            {
                "$lookup": {
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "_id",
                    "as": "userDetails"
                },
            },
            { "$unwind": "$userDetails" },
            
            {
                $group:{
                    '_id':"$_id",
                    'social_type':{$first:"$social_type"},
                    'post_content':{$first:"$post_content"},
                    'song_uri':{$first:"$song_uri"},
                    'original_song_uri':{$first:"$original_song_uri"},
                    'song_name':{$first:"$song_name"},
                    'song_image':{$first:"$song_image"},
                    'artist_name':{$first:"$artist_name"},
                    'album_name':{$first:"$album_name"},
                    'album_image':{$first:"$album_image"},
                    'isrc_code':{$first:"$isrc_code"},
                    'comment':{$first:"$comment"},
                    'reaction':{$first:"$reaction"},
                    'isActive':{$first:"$isActive"},
                    'user_id':{$first:"$user_id"},
                    'createdAt':{$first:"$createdAt"},
                    'userDetails':{$first:"$userDetails"},
                    
                },

            }
        ]).sort({_id:-1}).skip(skip).limit(parseInt(limit));

        if (!aggregate) {
            return null;
        }

        return aggregate;
    },
    getById: async (id) => {
        try {
            let posts = await Post.findById(id).exec();
            if (!posts) {
                return null;
            }
            return posts;

        } catch (e) {
            return e;
        }
    },

    getByField: async (params) => {

        try {
            let posts = await Post.findOne(params).exec();
            if (!posts) {
                return null;
            }
            return posts;

        } catch (e) {
            return e;
        }
    },

    getAllByField: async (params) => {
        try {
            let posts = await Post.find(params).sort({_id:-1}).exec();
            if (!posts) {
                return null;
            }
            return posts;

        } catch (e) {
            return e;
        }
    },

    
    updateById: async (data, id) => {
        try {
            let posts = await Post.findByIdAndUpdate(id, data, {new: true});

            if (!posts) {
                return null;
            }
            return posts;
        } catch (e) {
            return e;
        }
    },
    delete: async (id) => {
        try {
            
        } catch (e) {
            return e;
        }
    },

    deleteByField: async (field, fieldValue) => {
        //todo: Implement delete by field
    },


   
   

    save: async (data) => {
        try {
            let posts = await Post.create(data);
            if (!posts) {
                return null;
            }
            return posts;
        } catch (e) {
            return e;
        }
    },
    delete: async (params) => {

        try {
            let posts = await Post.remove(params).exec();
            if (!posts) {
                return null;
            }
            return posts;

        } catch (e) {
            return e;
        }
    },
    topFiftyApi:async(param)=>{
        let aggregate = await Post.aggregate([
            
            {
                $group:{
                    _id:"$song_name",
                    song_image:{$first:"$song_image"},
                    count:{$sum:1},
                    date:{$first:{ $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }}
                }
                
            },
            {$match:param},
            {$limit:50},
        ]).sort({count:-1});

        if (!aggregate) {
            return null;
        }
        return aggregate;
    },
};

module.exports = postRepository;