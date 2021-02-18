const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const multer = require('multer');
const userController = require('webservice/user.controller');


const Storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if (file.fieldname === 'profile_image') {
            callback(null, "./public/uploads/user/")
        }
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
});
const uploadFile = multer({storage: Storage});
const request_param = multer();

/**
 * @api {post} /user/available Email Available Check
 * @apiVersion 1.0.0
 * @apiParam {string} email Email.
 * @apiGroup User
 * @apiSuccessExample {json} Success
 *{
    "status": 200,
    "data": true,
    "message": "Email is already exists."
}
* @apiSuccessExample {json} Error
{
    "status": 200,
    "data": false,
    "message": ""
}
*/
namedRouter.post("api.user.emailAvailableCheck", '/user/available', request_param.any(), async (req, res) => {
    try {
        const success = await userController.usernameAvailable(req, res);
        // const success = await userController.emailAvailable(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});

/**
 * @api {post} /user/signup User Signup
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiParam {string} full_name Full Name
 * @apiParam {string} profile_image profile Image
 * @apiParam {string} username Username
 * @apiParam {string} location Location
 * @apiParam {string} social_username Username[spotyfy/ apple]
 * @apiParam {string} email Email
 * @apiParam {string} phone Phone
 * @apiParam {string} deviceToken Device Token
 * @apiParam {string} deviceType Device Type [android / ios]
 * @apiParam {string} social_id Social Id [ For  spotify or apple]
 * @apiParam {string} register_type [spotify / apple]
 * @apiSuccessExample {json} Success
 *{
    "status": 200,
    "data": {
        "full_name": "Node user",
        "username": "spotify",
        "social_username": "hello",
        "phone": "",
        "email": "laravel@gmail.com",
        "password": "",
        "profile_image": "profile_image_1588848830991_tst.jpg",
        "social_id": "123456",
        "register_type": "spotify",
        "isDeleted": false,
        "deviceToken": "",
        "deviceType": "android",
        "email_notification": true,
        "push_notification": true,
        "isActive": true,
        "_id": "5eb3e8bfc26a203c69957603",
        "role": "5ea174d3c7d64cd82bddd490",
        "createdAt": "2020-05-07T10:53:51.583Z",
        "updatedAt": "2020-05-07T10:53:51.583Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYjNlOGJmYzI2YTIwM2M2OTk1NzYwMyIsImlhdCI6MTU4ODg0ODgzMSwiZXhwIjoxNTkxNDQwODMxfQ.ElS8AEKyZsOmFVVrunyw3B5AZvfiv8qVBqOY3LaniHo",
    "message": "Registration successful."
}
*/

namedRouter.post("api.user.signup", '/user/signup', uploadFile.any(), async (req, res) => {
    try {
        const success = await userController.signup(req, res);
        res.status(success.status).send(success);
    }
    catch (error) {
        res.status(error.status).send(error);
    }
});

/**
 * @api {post} /user/signin User SignIn
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiParam {string} social_id Social Id
 * @apiParam {string} social_type Social Type [apple/spotify]
 * @apiParam {string} deviceToken Device Token
 * @apiParam {string} deviceType Device Type[ios/android]
 * @apiSuccessExample {json} Success
 *{
    "status": 200,
    "data": {
        "full_name": "Node user",
        "username": "spotify",
        "social_username": "hello",
        "phone": "",
        "email": "laravel@gmail.com",
        "password": "",
        "profile_image": "profile_image_1588848830991_tst.jpg",
        "social_id": "123456",
        "register_type": "spotify",
        "isDeleted": false,
        "deviceToken": "",
        "deviceType": "android",
        "email_notification": true,
        "push_notification": true,
        "isActive": true,
        "_id": "5eb3e8bfc26a203c69957603",
        "role": "5ea174d3c7d64cd82bddd490",
        "createdAt": "2020-05-07T10:53:51.583Z",
        "updatedAt": "2020-05-07T10:53:51.583Z"
    },
    "isLoggedIn": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYjNlOGJmYzI2YTIwM2M2OTk1NzYwMyIsImlhdCI6MTU4ODg1MDE5NCwiZXhwIjoxNTkxNDQyMTk0fQ.bSud3muISEB0xQ_JiIh3bX4A-_QyU_q4RhP_0WjrPYg",
    "message": "Login successful."
}
*/
namedRouter.post("api.user.signin", '/user/signin', request_param.any(), async (req, res) => {
    try {
        const success = await userController.signin(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});




/**
 * @api {post} /user/forgotpassword Forgot Password
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiParam email User's account Email
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": [],
    "message": "A verification code to reset your password sent to your registered email"
}
*/
namedRouter.post("api.user.forgotpassword", '/user/forgotpassword', request_param.any(), async (req, res) => {
    try {
        const success = await userController.forgotPassword(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});


namedRouter.all('/user*', auth.authenticateAPI);

/**
 * @api {get} /user/logout User Logout
 * @apiGroup User
 * @apiHeader x-access-token User's Access Token
 * @apiSuccessExample {json} Success
 *{
    "status": 200,
    "data": [],
    "isLoggedIn": false,
    "message": "Logout successfully"
}
*/
namedRouter.get("api.user.logout", '/user/logout', request_param.any(), async (req, res) => {
    try {
        const success = await userController.logout(req, res);
        res.status(success.status).send(success);
    }
    catch (error) {
        res.status(error.status).send(error);
    }
});

/**
 * @api {get} /user/profile User's Profile
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiHeader x-access-token User's Access token
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {
        "full_name": "Node user",
        "username": "spotify",
        "social_username": "hello",
        "phone": "",
        "email": "laravel@gmail.com",
        "password": "",
        "profile_image": "profile_image_1588848830991_tst.jpg",
        "social_id": "123456",
        "register_type": "spotify",
        "isDeleted": false,
        "deviceToken": "",
        "deviceType": "android",
        "email_notification": true,
        "push_notification": true,
        "isActive": true,
        "_id": "5eb3e8bfc26a203c69957603",
        "role": "5ea174d3c7d64cd82bddd490",
        "createdAt": "2020-05-07T10:53:51.583Z",
        "updatedAt": "2020-05-07T10:53:51.583Z"
    },
    "message": "Profile Info fetched Successfully"
}
*/

namedRouter.get('api.user.getprofile', '/user/profile', async (req, res) => {
    try {
        const success = await userController.getMyProfile(req);
        res.status(success.status).send(success);
    }
    catch (error) {
        res.status(error.status).send(error);
    }
});



/**
 * @api {post} /user/profile/update User profile update
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiHeader x-access-token User's Access Token

 * @apiparam {file} profile_image Profile Image [Multipart]
 * @apiparam {string} full_name Full Name
 * @apiparam {string} location Location
 * @apiparam {array} feature_song[0][song_name]
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {
        "first_name": "Johana",
        "last_name": "Black",
        "phone": "7894561236",
        "email": "johan@yopmail.com",
        "password": "$2a$08$POxN7JXDFAT7bkxkhaoQDebUT4iMPV3kcPRqxr9.Vh2lQ9vEpqj..",
        "profile_pic": "profile_pic_1586250554891_img3.jpg",
        "deviceToken": "123456789",
        "deviceType": "android",
        "verification_code": null,
        "social_id": "",
        "register_type": "normal",
        "isVerified": false,
        "isDeleted": false,
        "email_notification": true,
        "push_notification": true,
        "isActive": true,
        "_id": "5e871514d982311378cf3c6c",
        "role": "5e81bf47c7d64cd82b5348f1",
        "createdAt": "2020-04-03T10:51:00.684Z",
        "updatedAt": "2020-04-07T09:09:14.970Z"
    },
    "message": "User details updated successfully"
}
*/
namedRouter.post("api.user.profileUpdate", '/user/profile/update', uploadFile.any(), async (req, res) => {
    try {
        const success = await userController.updateProfile(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});

/**
 * @api {get} /user/profile/:id See user Profile
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiHeader x-access-token User's Access Token

 * @apiparam _id User _id
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {
        "_id": "5eb4199ac7d64cd82b33677b",
        "full_name": "DJ Ohem",
        "username": "spotify",
        "social_username": "user",
        "phone": "",
        "email": "test@gmail.com",
        "password": "",
        "profile_image": "profile_image_1588848830991_tst.jpg",
        "social_id": "45678",
        "register_type": "spotify",
        "isDeleted": false,
        "deviceToken": "",
        "deviceType": "android",
        "isActive": true,
        "role": "5ea174d3c7d64cd82bddd490",
        "createdAt": "2020-05-07T10:53:51.583Z",
        "updatedAt": "2020-05-11T13:38:48.932Z",
        "location": "kolkata",
        "follower": 1,
        "following": 1
    },
    "message": "Profile Info fetched Successfully"
}
*/
namedRouter.get('api.user.getuserprofile', '/user/profile/:id', async (req, res) => {
    try {
        const success = await userController.getUserProfile(req);
        res.status(success.status).send(success);
    }
    catch (error) {
        res.status(error.status).send(error);
    }
});

/**
 * @api {post} /user/search Search User
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiHeader x-access-token User's Access Token
 * @apiparam keyword Search keyword
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": [
        {
            "full_name": "DJ Ohem",
            "username": "spotify",
            "profile_image": "profile_image_1588848830991_tst.jpg",
            "_id": "5eb4199ac7d64cd82b33677b",
            "isFollowing": true
        }
    ],
    "message": "User list fetched successfully."
}
*/
namedRouter.post("api.user.search", '/user/search', uploadFile.any(), async (req, res) => {
    try {
        const success = await userController.searchUser(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});
/**
 * @api {post} /user/search Search With Phone
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiHeader x-access-token User's Access Token
 * @apiparam phone Phone in array [5555648583,5555648583]
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": [
        {
            "full_name": "Prithviraj Acharya",
            "username": "Prithviraj007",
            "profile_image": "profile_image_1596030784346_IMG_0650.PNG",
            "_id": "5f217f40411a74522398d1e6",
            "isFollowing": true
        }
    ],
    "message": "User list fetched successfully."
}
*/
namedRouter.post("api.user.searchPhone", '/user/phone', request_param.any(), async (req, res) => {
    try {
        const success = await userController.searchPhone(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});








// Export the express.Router() instance
module.exports = router;