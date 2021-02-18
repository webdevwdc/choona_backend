const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const multer = require('multer');
const request_param = multer();
const postController = require('webservice/post.controller');


namedRouter.all('/post*', auth.authenticateAPI);



/**
 * @api {post} /post/store  Store
 * @apiGroup Post
 * @apiParam {string} post_content Post Content
 * @apiParam {string} isrc_code Post Isrc Code
 * @apiParam {string} social_type Social Type ['apple','spotify']
 * @apiParam {string} song_name Song Name
 * @apiParam {string} song_uri Song Uri
 * @apiParam {string} original_song_uri Original Song Uri
 * @apiParam {string} genre Original Genre
 * @apiParam {string} song_image Song Image
 * @apiParam {string} artist_name Artist Name
 * @apiParam {string} album_name Album Name
 * @apiHeader (Headers) {String} x-access-token Users unique access-key.
 * @apiSuccessExample {json} Success
 *{
    "status": 200,
    "data": {
        "_id": "5eb523a9ed51692f40fcb817",
        "shared_user_id": "5eb3e8bfc26a203c69957603",
        "song_id": "5ea174f4c7d64cd82bddd54a",
        "user_id": "5eb3e8bfc26a203c69957603",
        "createdAt": "2020-05-08T09:17:29.522Z",
        "__v": 0
    },
    "message": "Your post saved successfully."
}
*/
namedRouter.post("api.post.store", '/post/store', request_param.any(), async (req, res) => {
    try {
        const success = await postController.store(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});

/**
 * @api {get} /post/list  List
 * @apiGroup Post
 * @apiHeader (Headers) {String} x-access-token Users unique access-key.
 * @apiSuccessExample {json} Success
 *{
    "status": 200,
    "data": [
        {
            "_id": "5ec4f3d5b7449d6d26701f81",
            "social_type": "apple",
            "post_content": "Great my Song! 🍟🍟",
            "song_uri": "https://audio-ssl.itunes.apple.com/itunes-assets/Music/c5/91/81/mzm.uiokdqnc.aac.p.m4a",
            "song_name": "Iktara",
            "song_image": "https://is3-ssl.mzstatic.com/image/thumb/Music123/v4/38/3d/95/383d95e8-6e44-8090-4d52-ed9daf26374c/source/100x100bb.jpg",
            "artist_name": "Amit Trivedi, Kavita Seth & Amitabh Bhattacharya",
            "album_name": "Wake Up Sid (Original Motion Picture Soundtrack)",
            "album_image": "",
            "user_id": "5ec4f365b7449d6d26701f80",
            "createdAt": "2020-05-20T09:09:41.810Z",
            "__v": 0,
            "userDetails": {
                "_id": "5ec4f365b7449d6d26701f80",
                "full_name": "Ranbir Kapoor",
                "username": "KingKapoor",
                "social_username": "Prithviraj",
                "email": "ghpfjv4ea6@privaterelay.appleid.com",
                "password": "",
                "profile_image": "profile_image_1589965669127_IMG_0007.JPG",
                "location": "Mumbai, India",
                "social_id": "000622.f54f4b43fe5f47f39faec1fde0505277.0656",
                "register_type": "apple",
                "isDeleted": false,
                "deviceToken": "123456",
                "deviceType": "ios",
                "isActive": true,
                "role": "5ea174d3c7d64cd82bddd490",
                "createdAt": "2020-05-20T09:07:49.384Z",
                "updatedAt": "2020-05-20T09:07:49.384Z"
            }
        }
    ],
    "message": "Your post fetched successfully."
}
*/
namedRouter.get("api.post.list", '/post/list', request_param.any(), async (req, res) => {
    try {
        const success = await postController.list(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});

/**
 * @api {post} /post/comment  Comment
 * @apiGroup Post
 * @apiParam {string} post_id Post Id
 * @apiParam {string} text Comment
 * @apiHeader (Headers) {String} x-access-token Users unique access-key.
 * @apiSuccessExample {json} Success
 *{
    "status": 200,
    "data": {
        "social_type": "spotify",
        "post_content": "YES",
        "song_uri": null,
        "song_name": "Memories",
        "song_image": "https://i.scdn.co/image/ab67616d0000b273b8c0135a218de2d10a8435f5",
        "artist_name": "Maroon 5",
        "album_name": "Memories",
        "album_image": "",
        "comment": [
            {
                "user_id": "5eb3e8bfc26a203c69957603",
                "text": "this is test comment",
                "profile_image": "profile_image_1588848830991_tst.jpg",
                "username": "spotify",
                "_id": "5ecd2c852be4ff55da0437b8",
                "createdAt": "2020-05-26T20:19:41+05:30"
            }
        ],
        "isActive": true,
        "_id": "5ecd16a8759fc49945cfc699",
        "user_id": "5ec2660e9179cfbd1fb06765",
        "createdAt": "2020-05-26T13:16:24.644Z",
        "__v": 0
    },
    "message": "Comment saved successfully."
}
*/
namedRouter.post("api.post.comment", '/post/comment', request_param.any(), async (req, res) => {
    try {
        const success = await postController.comment(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});

/**
 * @api {post} /post/reaction  Reaction
 * @apiGroup Post
 * @apiParam {string} post_id Post Id
 * @apiParam {string} text reaction
 * @apiHeader (Headers) {String} x-access-token Users unique access-key.
 * @apiSuccessExample {json} Success
 *{
    "status": 200,
    "data": {
        "social_type": "spotify",
        "post_content": "YES",
        "song_uri": null,
        "song_name": "Memories",
        "song_image": "https://i.scdn.co/image/ab67616d0000b273b8c0135a218de2d10a8435f5",
        "artist_name": "Maroon 5",
        "album_name": "Memories",
        "album_image": "",
        "comment": [
            {
                "user_id": "5eb3e8bfc26a203c69957603",
                "text": "this is test comment",
                "profile_image": "profile_image_1588848830991_tst.jpg",
                "username": "spotify",
                "_id": "5ecd2c852be4ff55da0437b8",
                "createdAt": "2020-05-26T20:19:41+05:30"
            },
            {
                "user_id": "5ec2a87ed303c2d04610ac13",
                "text": "Adam Levine is awesome",
                "profile_image": "profile_image_1589885126077_IMG_0008.JPG",
                "username": "Ezio Auditore",
                "_id": "5ece1bd317d49cdba30e843a",
                "createdAt": "2020-05-27T07:50:43+00:00"
            }
        ],
        "reaction": [
            {
                "user_id": "5eb3e8bfc26a203c69957603",
                "text": "this is test comment",
                "profile_image": "profile_image_1588848830991_tst.jpg",
                "username": "spotify",
                "_id": "5ece28122f0855232eb29e09",
                "createdAt": "2020-05-27T14:12:58+05:30"
            }
        ],
        "isActive": true,
        "_id": "5ecd16a8759fc49945cfc699",
        "user_id": "5ec2660e9179cfbd1fb06765",
        "createdAt": "2020-05-26T13:16:24.644Z",
        "__v": 0
    },
    "message": "Reaction saved successfully."
}
*/
namedRouter.post("api.post.reaction", '/post/reaction', request_param.any(), async (req, res) => {
    try {
        const success = await postController.reaction(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});

/**
 * @api {get} /post/topfifty  Top 50 Post/Song
 * @apiGroup Post
 * @apiHeader (Headers) {String} x-access-token Users unique access-key.
 * @apiSuccessExample {json} Success
 *{
    "status": 200,
    "data": [
        {
            "_id": "Believer",
            "song_image": "https://i.scdn.co/image/ab67616d0000b2735675e83f707f1d7271e5cf8a",
            "count": 3
        },
        {
            "_id": "I'm the One (feat. Justin Bieber, Quavo, Chance the Rapper & Lil Wayne)",
            "song_image": "https://i.scdn.co/image/ab67616d0000b273dcb6a73da1e7f293b875f69c",
            "count": 1
        },
        {
            "_id": "Vaaste",
            "song_image": "https://i.scdn.co/image/ab67616d0000b2738dce351c5e4a62c2ea2dd498",
            "count": 1
        },
        {
            "_id": "Do I Wanna Know?",
            "song_image": "https://is3-ssl.mzstatic.com/image/thumb/Music/v4/d7/ad/82/d7ad8214-a767-d275-8a20-f7359e3ac65d/source/100x100bb.jpg",
            "count": 1
        }
    ],
    "message": "Top 50 post fetched successfully."
}
*/
namedRouter.get("api.post.top50", '/post/topfifty', request_param.any(), async (req, res) => {
    try {
        const success = await postController.topFifty(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        console.log(219,error)
        res.status(error.status).send(error);
    }
});

/**
 * @api {get} /post/delete/:id  Delete
 * @apiGroup Post
 * @apiParam {string} id Post _id

 * @apiHeader (Headers) {String} x-access-token Users unique access-key.
 * @apiSuccessExample {json} Success
 *{
    "status": 200,
    "data": {
        "n": 1,
        "ok": 1,
        "deletedCount": 1
    },
    "message": "Your post is deleted successfully."
}
*/
namedRouter.get("api.post.delete", '/post/delete/:id', request_param.any(), async (req, res) => {
    try {
        const success = await postController.delete(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});

/**
 * @api {get} /post/details/:id  Post Details
 * @apiGroup Post
 * @apiParam {string} id Post _id

 * @apiHeader (Headers) {String} x-access-token Users unique access-key.
 * @apiSuccessExample {json} Success
 *{
    "status": 200,
    "data": {
        "social_type": "spotify",
        "post_content": "Yeah! ",
        "song_uri": "https://p.scdn.co/mp3-preview/d7369d506a0647ccd433c7d0ec290d8be52c186f?cid=c771eeb07b694b2bbf774cb3aa93bc65",
        "original_song_uri": "https://open.spotify.com/track/5cF0dROlMOK5uNZtivgu50",
        "genre": "",
        "song_name": "Attention",
        "song_image": "https://i.scdn.co/image/ab67616d0000b273897f73256b9128a9d70eaf66",
        "artist_name": "Charlie Puth",
        "album_name": "Voicenotes",
        "album_image": "",
        "comment": [
            {
                "user_id": "5f36b59c7cbe9a2baddc87bb",
                "text": "Yeahhhhhhh",
                "username": "Ezio Auditore",
                "_id": "5f36b7a17cbe9a2baddc87cd",
                "createdAt": "2020-08-14T16:11:13+00:00"
            }
        ],
        "reaction": [
            {
                "user_id": "5f36b59c7cbe9a2baddc87bb",
                "text": "🔥",
                "username": "Ezio Auditore",
                "_id": "5f36b7577cbe9a2baddc87c9",
                "createdAt": "2020-08-14T16:09:59+00:00"
            },
            {
                "user_id": "5f36b59c7cbe9a2baddc87bb",
                "text": "🕺",
                "username": "Ezio Auditore",
                "_id": "5f36b76e7cbe9a2baddc87cb",
                "createdAt": "2020-08-14T16:10:22+00:00"
            },
            {
                "user_id": "5f3b8a2200dd425036545b77",
                "text": "💃",
                "username": "Apple",
                "_id": "5f3e3235558917f39543f4cf",
                "createdAt": "2020-08-20T08:20:05+00:00"
            },
            {
                "user_id": "5f3b8a2200dd425036545b77",
                "text": "😍",
                "username": "Apple",
                "_id": "5f3e3500558917f39543f4d9",
                "createdAt": "2020-08-20T08:32:00+00:00"
            }
        ],
        "isrc_code": "",
        "isActive": true,
        "_id": "5f36b7467cbe9a2baddc87c8",
        "user_id": "5f36b6557cbe9a2baddc87bc",
        "createdAt": "2020-08-14T16:09:42.474Z",
        "__v": 0
    },
    "message": "Your post saved successfully."
}
*/
namedRouter.get("api.post.details", '/post/details/:id', request_param.any(), async (req, res) => {
    try {
        const success = await postController.details(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});

/**
 * @api {get} /post/topfifty top 50 post
 * @apiGroup Post
 * @apiHeader (Headers) {String} x-access-token Users unique access-key.
 * @apiSuccessExample {json} Success
 *{
    "status": 200,
    "data": {
        "n": 1,
        "ok": 1,
        "deletedCount": 1
    },
    "message": "Your post is fetched successfully."
}
*/
namedRouter.get("api.post.top50", '/post/topfifty', request_param.any(), async (req, res) => {
    try {
        const success = await postController.topFifty(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});






module.exports = router;