const mongoose = require('mongoose');
const Chat = require('chat/models/chat.model');
const perPage = config.PAGINATION_PERPAGE;


const chatRepository = {

    list: async (param) => {
        try {
            let activities = await Activity.aggregate([
                {$match:param},
                { "$lookup": {
                    "from": "users",
                    "localField": "from_user_id",
                    "foreignField": "_id",
                    "as": "fromUsers"
                    }
                },
                { "$unwind": "$fromUsers" },
                {
                    "$group":{
                        '_id':"$_id",
                        'full_name':{$first:"$fromUsers.full_name"},
                        'profile_image':{$first:"$fromUsers.profile_image"},
                        'username':{$first:"$fromUsers.username"},
                        'user_id':{$first:"$fromUsers._id"},
                        'activity_type':{$first:"$activity_type"},
                        'createdAt':{$first:"$createdAt"},
                        'text':{$first:"$text"},
                        'image':{$first:"$image"},
                        'from_user_id':{$first:"$from_user_id"},
                    }
                }

            ]).sort({'createdAt':-1});
            if (!activities) {
                return null;
            }

            return activities;

        } catch (e) {
            return e;
        }
    },
    
    getById: async (id) => {
        try {
            let chats = await Chat.findById(id).exec();
            if (!chats) {
                return null;
            }
            return chats;

        } catch (e) {
            return e;
        }
    },

    getByField: async (params) => {

        try {
            let chats = await Chat.findOne(params).exec();
            if (!chats) {
                return null;
            }
            return chats;

        } catch (e) {
            return e;
        }
    },

    getAllByField: async (params) => {
        try {
            
            let chats = await Chat.find(params).exec();
            if (!chats) {
                return null;
            }
            return chats;

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
            let chats = await Chat.create(data);
            if (!chats) {
                return null;
            }
            return chats;
        } catch (e) {
            return e;
        }
    },
};

module.exports = chatRepository;