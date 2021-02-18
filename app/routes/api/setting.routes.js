const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const multer = require('multer');
const request_param = multer();
const settingController = require('webservice/setting.controller');


/**
 * @api {get} /setting/all All Setting
 * @apiVersion 1.0.0
 * @apiGroup Setting
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": [
        {
            "setting_name": "Site Email",
            "setting_slug": "site-email",
            "setting_value": "info@choona.com",
            "status": "Active",
            "isDeleted": false,
            "_id": "5e81a7b8c7d64cd82b52eb63"
        },
        {
            "setting_name": "Phone",
            "setting_slug": "phone",
            "setting_value": "1234567890",
            "status": "Active",
            "isDeleted": false,
            "_id": "5e81a7e1c7d64cd82b52ec22"
        }
    ],
    "message": "Setting Data fetched Successfully"
}
*/
namedRouter.get("api.setting.all", '/setting/all', async (req, res) => {
    try {
        const success = await settingController.getAllSetting(req);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error.message);
    }
});


module.exports = router;