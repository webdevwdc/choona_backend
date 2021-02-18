const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const multer = require('multer');
const request_param = multer();
const activityController = require('webservice/activity.controller');


namedRouter.all('/activity*', auth.authenticateAPI);

/**
 * @api {get} /activity/list  My Activity List
 
 * @apiGroup Activity

 * @apiHeader (Headers) {String} x-access-token Users unique access-key.
 * @apiSuccessExample {json} Success
 *{
    "status": 200,
    "data": [
        {
            "_id": "5eb538f5521e0638a5bceadb",
            "full_name": "Jhon doe",
            "profile_image": "profile_image_1588848830991_tst.jpg",
            "username": "spotify",
            "user_id": "5eb3e8bfc26a203c69957603",
            "activity_type": "following",
            "created_at": null
        }
    ],
    "message": "Your activities fetched successfully."
}
*/

namedRouter.get("api.activity.list", '/activity/list', request_param.any(), async (req, res) => {
    try {
        const success = await activityController.activityList(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});


module.exports = router;