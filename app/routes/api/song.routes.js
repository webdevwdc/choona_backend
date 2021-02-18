const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const multer = require('multer');
const request_param = multer();
const songController = require('webservice/song.controller');


/**
 * @api {get} /song/spotify/:id Spotyfy data
 * @apiVersion 1.0.0
 * @apiGroup Song
 * @apiParam {string} id Spotify Id
 * @apiHeader x-access-token User's Access Token
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {
        "date": "2018-06-15",
        "title": "Immaterial",
        "type": "track",
        "track": "Immaterial",
        "artist": "SOPHIE",
        "image": "https://i.scdn.co/image/ab67616d0000b2736b03d8c63599cc94263d7d60",
        "audio": "https://p.scdn.co/mp3-preview/6be8eb12ff18ae09b7a6d38ff1e5327fd128a74e?cid=a46f5c5745a14fbf826186da8da5ecc3",
        "link": "https://open.spotify.com/track/6GoLARmR2OZl2EldehFrsA",
        "embed": "https://embed.spotify.com/?uri=spotify:track:6GoLARmR2OZl2EldehFrsA"
    },
    "message": "Song fetched successfully."
}
*/
namedRouter.get("api.song.spotify", '/song/spotify/:id', request_param.any(), async (req, res) => {
    try {
        const success = await songController.dataSpoity(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});





namedRouter.all('/song*', auth.authenticateAPI);

/**
 * @api {post} /song/list  List
 * @apiGroup Song
 * @apiHeader (Headers) {String} x-access-token Users unique access-key.
 * @apiSuccessExample {json} Success
 *{
    "status": 200,
    "data": [
        {
            "song_name": "CASTLE OF GLASS",
            "song_image": "https://is3-ssl.mzstatic.com/image/thumb/Music/v4/5a/84/ef/5a84efde-05f5-f5ec-8361-a257840e2a1d/source/100x100bb.jpg",
            "song_uri": "https://audio-ssl.itunes.apple.com/itunes-assets/Music/b1/ed/04/mzm.scpsmhis.aac.p.m4a",
            "artist_name": "LINKIN PARK",
            "album_name": "LIVING THINGS",
            "album_image": "",
            "isActive": true,
            "_id": "5ecce4adbf7777276d11aa86",
            "user_id": "5eb3e8bfc26a203c69957603",
            "createdAt": "2020-05-26T09:43:09.222Z",
            "__v": 0
        }
    ],
    "message": "Your song fecthed successfully."
}
*/

namedRouter.get("api.song.list", '/song/list', request_param.any(), async (req, res) => {
    try {
        const success = await songController.list(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});

/**
 * @api {post} /song/store  Store Song
 * @apiGroup Song
 * @apiParam {string} post_id Post _id
 * @apiParam {string} song_uri Song URI
 * @apiParam {string} original_song_uri Original Song Uri
 * @apiParam {string} song_name Song Name
 * @apiParam {string} song_image Song Image
 * @apiParam {string} artist_name Artist Name
 * @apiParam {string} album_name Album Name
 * @apiHeader (Headers) {String} x-access-token Users unique access-key.
 * @apiSuccessExample {json} Success
 *{
    "status": 200,
    "data": {
        "_id": "5eb52192ecb87c2c4eedf42e",
        "song_id": "5ea174f4c7d64cd82bddd54a",
        "user_id": "5eb3e8bfc26a203c69957603",
        "createdAt": "2020-05-08T09:08:34.833Z",
        "__v": 0
    },
    "message": "Your song saved successfully."
}
*/
namedRouter.post("api.song.store", '/song/store', request_param.any(), async (req, res) => {
    try {
        const success = await songController.store(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});

/**
 * @api {post} /song/sent/store  Share / Send Song
 * @apiGroup Song
 * @apiParam {id} song_id Song Id
 * @apiParam {id} shared_user_id User id to send song
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
    "message": "Your song shared successfully."
}
*/
namedRouter.post("api.song.send", '/song/sent/store', request_param.any(), async (req, res) => {
    try {
        const success = await songController.saveSent(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});

/**
 * @api {get} /song/remove/:id  Unsave Song
 * @apiGroup Song
 * @apiParam {string} id Song _id
 * @apiHeader (Headers) {String} x-access-token Users unique access-key.
 * @apiSuccessExample {json} Success
 *{
    "status": 200,
    "data": {
        "n": 1,
        "ok": 1,
        "deletedCount": 1
    },
    "message": "Your song removed successfully."
}
*/
namedRouter.get("api.song.remove", '/song/remove/:id', request_param.any(), async (req, res) => {
    try {
        const success = await songController.remove(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});

/**
 * @api {post} /song/search Search Song
 * @apiVersion 1.0.0
 * @apiGroup Song
 * @apiHeader x-access-token User's Access Token
 * @apiparam keyword Search keyword
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": [
        {
            "song_name": "Dooriyan (feat. Kaprila)",
            "song_image": "https://i.scdn.co/image/ab67616d0000b273d2b246039072d2e39914e352",
            "song_uri": "https://p.scdn.co/mp3-preview/83e10bf66c3d60125621e4a2e98da58bd0a80a3a?cid=c771eeb07b694b2bbf774cb3aa93bc65",
            "artist_name": "Dino James, Kaprila",
            "album_name": "Dooriyan (feat. Kaprila)",
            "album_image": "",
            "isActive": true,
            "_id": "5ecd1ac314a195af02f1b560",
            "post_id": "5ecd19bc6f5ecca3834d1ed2",
            "user_id": "5ec2660e9179cfbd1fb06765",
            "createdAt": "2020-05-26T13:33:55.456Z",
            "__v": 0
        }
    ],
    "message": "Song fetched successfully."
}
*/
namedRouter.post("api.song.search", '/song/search', request_param.any(), async (req, res) => {
    try {
        const success = await songController.search(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});





module.exports = router;