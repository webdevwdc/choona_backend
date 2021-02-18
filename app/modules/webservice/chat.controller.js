const mongoose = require("mongoose");
const chatRepo = require('chat/repositories/chat.repository');
const userRepo = require('user/repositories/user.repository');
const express = require("express");
const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);
const querystring = require("querystring");
var moment = require("moment");
const { forEach } = require('p-iteration');

/*for push notification*/
var push = require('push/controllers/push.controller.js');
var FCM = require('fcm-push');
var apn = require('apn');
var serverKey = config.android_serverKey;
var fcm = new FCM(serverKey);
/*end section*/

let admin = require('firebase-admin');
let firbaseAccount = require("../../helper/choona_adminsdk.json");

admin.initializeApp({
    credential: admin.credential.cert(firbaseAccount),
    databaseURL: "https://choona-8db54.firebaseio.com"
});



class chatController {
    constructor() { }

    /* 
    // @Method: create
    // @Description: chat create
    */
    async create(req) {
        try {

            let searchData = [];
            const start = async () => {
                await asyncForEach(req.body.receiver_id, async (data) => {
                    let chat = await chatRepo.getByField({
                        $or: [
                            { 'sender_id': mongoose.Types.ObjectId(req.user._id), 'receiver_id': mongoose.Types.ObjectId(data) },
                            { 'receiver_id': mongoose.Types.ObjectId(req.user._id), 'sender_id': mongoose.Types.ObjectId(data) }
                        ]
                    });
                    if (!_.isEmpty(chat)) {
                        searchData.push(chat);
                    } else {
                        let saveChat = await chatRepo.save({ sender_id: req.user._id, receiver_id: data });
                        searchData.push(saveChat);
                    }
                });
            }


            await start();
            return { status: 200, data: searchData, "message": "Chat saved successfully." };
            async function asyncForEach(array, callback) {
                for (let index = 0; index < array.length; index++) {
                    await callback(array[index], index, array);
                }
            }

        } catch (e) {
            return { status: 500, data: [], message: e.message };
        }
    }

    async list(req) {
        try {

            let chatData = []; let chatData1 = []; var childId = '';
            var keyId;
            let chat = await chatRepo.getAllByField({ $or: [{ 'sender_id': mongoose.Types.ObjectId(req.user._id) }, { 'receiver_id': mongoose.Types.ObjectId(req.user._id) }] });
            var resArr = [];
            var snapshot; var chat_id;
            if (!_.isEmpty(chat)) {

                var cnt = 0;
                for (var c = 0; c < chat.length; c++) {
                    var time = 'Mon Dec 09 1920 11:59:58 GMT+0530';

                    let messagesRef = await admin.database().ref(`chatMessages`);
                    snapshot = await messagesRef.child(`${chat[c]._id}`).orderByChild('createdAt').limitToLast(100).once('value');
                    let record = await snapshot.val();
                    var keyIdArr = [];
                    if (!_.isNull(record)) {
                        //console.log(record);
                        let msgTimestamp = _.pluck(record, 'time')[0];
                        let message = _.pluck(record, 'message')[0];
                        let receiverId = _.pluck(record, 'receiver_id')[0];

                        if (receiverId == req.user._id) {
                            receiverId = _.pluck(record, 'sender_id')[0];
                        }
                        record.user_id = receiverId;

                        let getUserData = await userRepo.getById(receiverId);

                        if (!_.isEmpty(getUserData)) {
                            record.profile_image = getUserData.profile_image;
                            record.full_name = getUserData.full_name;
                            record.username = getUserData.username;
                            record.chat_token = chat[c]._id;//chatId._id;
                            chatData.push(record);
                        }

                        snapshot.forEach(function (child) {
                            //console.log(' <><><> ', child.key);
                            //console.log(' <><><> ', child.val().time);
                            if (moment(child.val().time).isSameOrAfter(time)) {
                                keyIdArr.push(child.key);
                                keyId = child.key;
                                time = child.val().time;
                                childId = `${chat[c]._id}`;
                            }
                        });
                        //console.log('===================');
                        //console.log(chat[c]._id);
                        //console.log(keyIdArr, '<><><>', keyIdArr.length);
                        let snapshot1 = await messagesRef.child(childId + '/' + keyId).orderByChild('createdAt').limitToLast(100).once('value');
                        let record1 = await snapshot1.val();

                        if (!_.isNull(record1)) {

                            //chk msg is deleted or not
                            var isDeleted = false;
                            if (!_.isUndefined(record1.userDeletedArr)) {
                                var userDeletedArr = record1.userDeletedArr;
                                isDeleted = userDeletedArr.includes(req.user._id.toString());
                            }

                            if (!isDeleted) {
                                let receiverId = record1.receiver_id;

                                if (receiverId == req.user._id) {
                                    receiverId = record1.sender_id;
                                }
                                record1.user_id = receiverId;
                                record1.user_id = receiverId;
                                let getUserData = await userRepo.getById(receiverId);

                                if (!_.isEmpty(getUserData)) {
                                    record1.profile_image = getUserData.profile_image;
                                    record1.full_name = getUserData.full_name;
                                    record1.username = getUserData.username;
                                    record1.chat_token = chat[c]._id;

                                    chatData1.push(record1);
                                }
                            }

                        }

                        resArr[cnt] = chatData1;
                        cnt++;
                    }
                }

                if (!_.isEmpty(resArr[0])) {
                    return { status: 200, data: resArr[0], "message": "Chat list fetched successfully." };
                } else {
                    return { status: 200, data: [], "message": "Chat list fetched successfully." };
                }
                return { status: 200, data: resArr[0], "message": "Chat list fetched successfully." };

            } else {
                return { status: 201, data: [], "message": "No chat found." };
            }

        } catch (e) {

            return { status: 500, data: [], message: e.message };
        }
    }

    async listBKP(req) {
        try {

            let chatData = []; let chatData1 = []; var childId = '';
            let chat = await chatRepo.getAllByField({ $or: [{ 'sender_id': mongoose.Types.ObjectId(req.user._id) }, { 'receiver_id': mongoose.Types.ObjectId(req.user._id) }] });

            // let messagesRef1 = await admin.database().ref(`chatMessages`);
            // messagesRef1.orderByChild("time").on("child_added", function (data) {
            //     console.log((data));
            // });
            var time = 'Mon Dec 09 1920 11:59:58 GMT+0530'; var keyId;
            if (!_.isEmpty(chat)) {
                const start = async () => {
                    await asyncForEach(chat, async (chatId) => {

                        let messagesRef = await admin.database().ref(`chatMessages`);
                        //const snapshot = await messagesRef.child(`${chatId._id}`).orderByChild('createdAt').limitToLast(1).once('value');

                        //const snapshot = await messagesRef.child(`${chatId._id}`).once('value');

                        var snapshot = await messagesRef.child(`${chatId._id}`).orderByChild('createdAt').limitToLast(100).once('value');
                        let record = await snapshot.val();

                        if (!_.isNull(record)) {
                            let msgTimestamp = _.pluck(record, 'time')[0];

                            let message = _.pluck(record, 'message')[0];

                            let receiverId = _.pluck(record, 'receiver_id')[0];

                            if (receiverId == req.user._id) {
                                receiverId = _.pluck(record, 'sender_id')[0];
                            }
                            record.user_id = receiverId;
                            let getUserData = await userRepo.getById(receiverId);

                            if (!_.isEmpty(getUserData)) {
                                record.profile_image = getUserData.profile_image;
                                record.full_name = getUserData.full_name;
                                record.username = getUserData.username;
                                record.chat_token = chatId._id;

                                chatData.push(record);
                            }
                        }

                        snapshot.forEach(function (child) {
                            if (moment(child.val().time).isSameOrAfter(time)) {

                                keyId = child.key;
                                time = child.val().time;
                                childId = `${chatId._id}`;
                            }
                        });



                    });
                    /*console.log(childId);
                    console.log(keyId);
                    console.log(time);*/

                    let snapshot = await messagesRef.child(childId + '/' + keyId).orderByChild('createdAt').limitToLast(100).once('value');
                    let record1 = await snapshot.val();

                    if (!_.isNull(record1)) {

                        let receiverId = record1.receiver_id;

                        if (receiverId == req.user._id) {
                            receiverId = record1.sender_id;
                        }
                        record1.user_id = receiverId;
                        let getUserData = await userRepo.getById(receiverId);

                        if (!_.isEmpty(getUserData)) {
                            record1.profile_image = getUserData.profile_image;
                            record1.full_name = getUserData.full_name;
                            record1.username = getUserData.username;
                            //record1.chat_token = chatId._id;

                            chatData1.push(record1);
                        }
                    }
                    // let zonesRef = await admin.database().ref(`chatMessages`);
                    // let zone1Ref = zonesRef.child("5f8ef4202b74738cb3aa9093").once('value');
                    // let zone1NameRef = zone1Ref.child("MMQSiGtlMrdw-MffG4N").once('value');

                    // let record1 = await zone1NameRef.val();
                    // console.log(keyId + "<><> " + time, " <><> ", record1);



                    //_.sortBy(chatData, 'time');


                }


                await start();
                /*******/



                /*******/
                return { status: 200, data: chatData, last_msg: chatData1[0], "message": "Chat saved successfully." };
                async function asyncForEach(array, callback) {
                    for (let index = 0; index < array.length; index++) {
                        await callback(array[index], index, array);
                    }
                }
            } else {
                return { status: 201, data: [], "message": "No chat found." };
            }


        } catch (e) {

            return { status: 500, data: [], message: e.message };
        }
    }


    /* 
    // @Method: removeNew
    // @Description: chat remove
    */
    async removeNew(req) {
        try {

            var user_id = req.user._id;
            var chat_token = req.body.chat_token;

            let messagesRef = await admin.database().ref(`chatMessages`);
            var snapshot = await messagesRef.child(chat_token).once('value');
            //var snapshot = await messagesRef.child(`5f8e91718c3539b9bf3d05aa`).once('value');
            let record = await snapshot.val();
            var keyIdArr = [];
            var newObj = {}; var deletedArr = [];
            for (let rc in record) {
                keyIdArr.push(rc);
            }

            for (var i = 0; i < keyIdArr.length; i++) {
                let snapshot1 = await messagesRef.child(chat_token + '/' + keyIdArr[i]).once('value');
                //let snapshot1 = await messagesRef.child('5f8e91718c3539b9bf3d05aa/' + keyIdArr[i]).once('value');
                let record1 = await snapshot1.val();

                newObj.album_name = record1.album_name;
                newObj.artist_name = record1.artist_name;
                newObj.image = record1.image;
                newObj.isrc_code = record1.isrc_code;
                newObj.message = record1.message;
                newObj.original_reg_type = record1.original_reg_type;
                newObj.original_song_uri = record1.original_song_uri;
                newObj.read = record1.read;
                newObj.receiver_id = record1.receiver_id;
                newObj.sender_id = record1.sender_id;
                newObj.song_name = record1.song_name;
                newObj.song_uri = record1.song_uri;
                newObj.time = record1.time;

                if (!_.isUndefined(record1.userDeletedArr)) {
                    deletedArr = record1.userDeletedArr;
                    deletedArr.push(user_id.toString());
                } else {
                    deletedArr = [user_id.toString()];
                }
                newObj.userDeletedArr = deletedArr;

                await messagesRef.child(chat_token + '/' + keyIdArr[i]).set(newObj);
                //await messagesRef.child('5f8e91718c3539b9bf3d05aa/' + keyIdArr[i]).set(newObj);
            }

            return { status: 200, data: [], message: 'Message thread deleted successfully.' };

        } catch (e) {
            console.log(e.message);
            return { status: 500, data: [], message: e.message };
        }
    }

    /* 
    // @Method: remove
    // @Description: chat remove
    */
    async remove(req) {
        try {

            let messagesRef = admin.database().ref(`chatMessages/${req.body.chatToken}`);
            let removeMessageThread = await messagesRef.remove();

            let deletingUserId = req.user._id;
            let query = { $and: [{ $or: [{ sender_id: deletingUserId }, { receiver_id: deletingUserId }] }, { isActive: true }, { isDeleted: false }, { chat_id: req.body.chatToken }] };

            const messagingData = await chatRepo.getByField(query);

            if (!messagingData) {
                return { status: 201, data: [], message: 'Invalid Request' };
            }

            let deleteMessageingRecord = await messagingRepo.updateById({ isDeleted: false }, messagingData._id);
            return { status: 200, data: [], message: 'Message Thread deleted Successfully' };

        } catch (e) {
            console.log(e.message);
            return { status: 500, data: [], message: e.message };
        }

    }

    /* 
    // @Method: sendPush
    // @Description: chat sendPush on child added
    */
    async sendPush(req) {
        try {
            let chatRecord = await chatRepo.getByField({ $or: [{ receiver_id: req.user._id, sender_id: req.user._id }, { receiver_id: req.user._id, sender_id: req.user._id }] });

            let chatToken = '';
            if (chatRecord) {
                chatToken = chatRecord.chat_id;
            }
            //let user = await userRepo.getById(mongoose.Types.ObjectId(req.body.receiver_id));

            let user = await userRepo.getById(mongoose.Types.ObjectId(req.body.receiverId));

            let fromUser = await userRepo.getById(req.user._id);

            var device_token = user.deviceToken;
            var device_type = user.deviceType;
            if (device_token != '' && device_type != '') {
                var to = user._id;
                var from = '';
                var badge = parseInt(user.badge_count) + parseInt(1);
                const type = 'messageSent';
                var title = fromUser.full_name + ' sent you a new message';
                var params = { "type": "postComment", "text": req.body.song_name + ' - ' + req.body.artist_name };
                var contentAvailable = false;
                let server = push.sendPush("messageSent", device_type, device_token, title, params, from, to, type, badge, contentAvailable);
                return { status: 200, data: [], message: 'Push sent Successfully' };
            }


        } catch (e) {
            return { status: 500, data: [], message: e.message };
        }
    }

}

module.exports = new chatController();

/*For Chat Push Notification*/
let messagesRef = admin.database().ref(`chatMessages`);

messagesRef.orderByChild('createdAt').on("child_added", async function (snapshot) {
    var changedPost = snapshot.val();

    var keys1 = Object.keys(snapshot.val() || {});
    var lastIdInSnapshot1 = keys1[keys1.length - 1]
    //console.log(lastIdInSnapshot1);
    if (!_.isEmpty(snapshot.val()[lastIdInSnapshot1])) {
        let document = snapshot.val()[lastIdInSnapshot1];

        if (document.read == false || document.read == 'false') {
            let chatRecord = await chatRepo.getByField({ $or: [{ receiver_id: document.receiver_id, sender_id: document.sender_id }, { receiver_id: document.sender_id, sender_id: document.receiver_id }] });

            let chatToken = '';
            if (chatRecord) {
                chatToken = chatRecord.chat_id;
            }
            let user = await userRepo.getById(document.receiver_id);

            let fromUser = await userRepo.getById(document.sender_id);

            var device_token = user.deviceToken;
            var device_type = user.deviceType;
            if (device_token != '' && device_type != '') {
                var to = user._id;
                var from = '';
                var badge = parseInt(user.badge_count) + parseInt(1);
                const type = 'messageSent';
                var title = fromUser.full_name + ' sent you a new message';
                var params = { "type": "postComment", "text": document.song_name + ' - ' + document.artist_name };
                var contentAvailable = false;
                let server = push.sendPush("messageSent", device_type, device_token, title, params, from, to, type, badge, contentAvailable);
            }

        }
    }
});


/*on child change*/
messagesRef.orderByChild('createdAt').on("child_changed", async function (snapshot) {
    var changedPost = snapshot.val();

    var keys1 = Object.keys(snapshot.val() || {});
    var lastIdInSnapshot1 = keys1[keys1.length - 1]
    //console.log(lastIdInSnapshot1);
    if (!_.isEmpty(snapshot.val()[lastIdInSnapshot1])) {
        let document = snapshot.val()[lastIdInSnapshot1];

        if (document.read == false || document.read == 'false') {
            let chatRecord = await chatRepo.getByField({ $or: [{ receiver_id: document.receiver_id, sender_id: document.sender_id }, { receiver_id: document.sender_id, sender_id: document.receiver_id }] });

            let chatToken = '';
            if (chatRecord) {
                chatToken = chatRecord.chat_id;
            }
            let user = await userRepo.getById(document.receiver_id);

            let fromUser = await userRepo.getById(document.sender_id);

            var device_token = user.deviceToken;
            var device_type = user.deviceType;
            if (device_token != '' && device_type != '') {
                var to = user._id;
                var from = '';
                var badge = parseInt(user.badge_count) + parseInt(1);
                const type = 'messageSent';
                var title = fromUser.full_name + ' sent you a new message';
                var params = { "type": "postComment", "text": document.song_name + ' - ' + document.artist_name };
                var contentAvailable = false;
                let server = push.sendPush("messageSent", device_type, device_token, title, params, from, to, type, badge, contentAvailable);
            }

        }
    }
});

/*End chat push notification section*/
