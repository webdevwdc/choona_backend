var Q = require('q');
var FCM = require('fcm-push');
var apn = require('apn');
const mongoose = require("mongoose");
//var config = require('../../config/config')
var pushRepo = require('push/repositories/push.repository');
const userModel = require('user/models/user.model');

// ================= for ANDROID push Notification ==========================================
var serverKey = config.android_serverKey;

var fcm = new FCM(serverKey);
// ================= for ANDROID push Notification ==========================================



/*iso push start*/
var options = {
    token: {
        key: config.ios_key,
        keyId: config.ios_keyId,
        teamId: config.ios_teamId
    },
    production: false
};
var apnProviderForDriver = new apn.Provider(options);

/*end ios push*/

exports.sendPush = function (clickAction, deviceType, deviceToken, title, params,from,to,type,badge,contentAvailable) {
	

	var deferred = Q.defer();
	var topic = "com.webskitters.Choona";

	if (deviceType.toLowerCase() == "ios") {
		var note = new apn.Notification();
		note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
		note.badge = badge;
		note.title = title;
		note.payload = params;
		note.body = params.text;
		note.topic = topic;
		note.sound = contentAvailable==false?'default':'';
		note.content_available = contentAvailable,
		
		
		
		apnProviderForDriver.send(note, deviceToken).then((result) => {
			
                var pushObject = {};
                pushObject.title = title;
                pushObject.to = to;
                pushObject.message = params;
                pushObject.date = new Date();
                userModel.updateOne({_id:mongoose.Types.ObjectId(to)},{badge_count:badge},function(err,result){
                	console.log(err)
                });
                /*pushRepo.save(pushObject, function (err, result) {
                    if (err) deferred.reject({ "status": 500, data: [], "message": err.message });
                    deferred.resolve({ "status": 200, data: [], "message": "Saved Successfully" });

                });*/
		});
	}else{ //android
		var message = {
			to: deviceToken, 
			collapse_key: 'new_messages', 
			data: {
				type: params.type,
				
			},
			notification: {
				title: title,
				body: params.text,
				sound: 'default',
				tag: "new_messages",
				//click_action: clickAction,
			}
		};

		
		fcm.send(message).then(function (response) {
			
            var pushObject = {};
            pushObject.title = title;
            pushObject.to = to;
            pushObject.message = params;
            pushObject.date = new Date();
            userModel.updateOne({_id:mongoose.Types.ObjectId(to)},{badge_count:badge},function(err,result){
            	console.log(err)
            });
           /* pushRepo.save(pushObject, function (err, result) {
               if (err) deferred.reject({ "status": 500, data: [], "message": err.message });
                deferred.resolve({ "status": 200, data: [], "message": "Saved Successfully" });

            })*/
		})
		.catch(function (err) {
			deferred.reject({ "status": 403, data: [], "message": err });
		});
	}
	//return deferred.promise;
};
