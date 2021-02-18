const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const multer = require('multer');
const request_param = multer();
const userFollowerController = require('webservice/follower.controller');


namedRouter.all('/follower*', auth.authenticateAPI);
/**
 * @api {post} /follower/user/store  Follow Create Or Delete
 * @apiGroup User
 * @apiParam {id} follower_id Visited user Id
 * @apiHeader (Headers) {String} x-access-token Users unique access-key.
 * @apiSuccessExample {json} Success
 *{
    "status": 201,
    "data": {
        "_id": "5eb411ddb96f61589dad3c61",
        "user_id": "5eb3e8bfc26a203c69957603",
        "follower_id": "5ea174f4c7d64cd82bddd54a",
        "createdAt": "2020-05-07T13:49:17.019Z",
        "__v": 0
    },
    "message": "You have follwed this user successfully."
}
*/
namedRouter.post("api.follower.store", '/follower/user/store', request_param.any(), async (req, res) => {
    try {
        const success = await userFollowerController.followUnfollow(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});

/**
 * @api {get} /follower/list Follower List
 * @apiGroup User

 * @apiHeader (Headers) {String} x-access-token Users unique access-key.
 * @apiSuccessExample {json} Success
 *{
    "status": 200,
    "data": [
        {
            "_id": "5eb41594271eb75b623492e4",
            "full_name": "New User",
            "profile_image": null,
            "username": null,
            "user_id": "5ea174f4c7d64cd82bddd54a"
        }
    ],
    "message": "My follower list."
}
*/

namedRouter.get("api.follower.list", '/follower/list', request_param.any(), async (req, res) => {
    try {
        const success = await userFollowerController.followerList(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});

/**
 * @api {get} /follower/following/list  My Following List
 * @apiGroup User

 * @apiHeader (Headers) {String} x-access-token Users unique access-key.
 * @apiSuccessExample {json} Success
 *{
    "status": 200,
    "data": [
        {
            "_id": "5eb41a21c7d64cd82b336b86",
            "full_name": "DJ Ohem",
            "profile_image": "profile_image_1588848830991_tst.jpg",
            "username": "spotify",
            "user_id": "5eb4199ac7d64cd82b33677b"
        }
    ],
    "message": "Your following list fetched successfully."
}
*/
namedRouter.get("api.following.list", '/follower/following/list', request_param.any(), async (req, res) => {
    try {
        const success = await userFollowerController.followingList(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});

/**
 * @api {get} /follower/top/list  Top 5 followed User List
 * @apiGroup User

 * @apiHeader (Headers) {String} x-access-token Users unique access-key.
 * @apiSuccessExample {json} Success
 *{
    "status": 200,
    "data": [
        {
            "_id": "5ec3980b15506ba0d7a2bc31",
            "full_name": "Sanjib Sarkar",
            "username": "sanjib.sarkar",
            "profile_image": "profile_image_1589880575218_xyz.jpg",
            "isActive": true,
            "isDeleted": false,
            "topFollwersCount": 3
        },
        {
            "_id": "5ecbbb38efa5f881e2c3f6a2",
            "full_name": "Kausambi william jonas gomes  back",
            "username": "isa",
            "profile_image": "profile_image_1590412767996_xyz.jpg",
            "isActive": true,
            "isDeleted": false,
            "topFollwersCount": 2
        },
        {
            "_id": "5ecbfe9329fc19a7d086ebd5",
            "full_name": "Andy Jones",
            "username": "andy88jones",
            "profile_image": "profile_image_1590689394439_IMG_3559.HEIC",
            "isActive": true,
            "isDeleted": false,
            "topFollwersCount": 2
        },
        {
            "_id": "5ec4f365b7449d6d26701f80",
            "full_name": "Ranbir Kapoor",
            "username": "KingKapoor",
            "profile_image": "profile_image_1589965669127_IMG_0007.JPG",
            "isActive": true,
            "isDeleted": false,
            "topFollwersCount": 2
        },
        {
            "_id": "5edfef27689e3f3432392dfb",
            "full_name": "Keith",
            "username": "krjsub",
            "profile_image": "profile_image_1591734054957_IMG_3972.JPG",
            "isActive": true,
            "isDeleted": false,
            "topFollwersCount": 1
        }
    ],
    "message": "Top Follower list fetched successfully."
}
*/
namedRouter.get("api.follower.top", '/follower/top/list', request_param.any(), async (req, res) => {
    try {
        const success = await userFollowerController.topFollowers(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});



module.exports = router;