const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const userController = require('user/controllers/user.controller');

const multer = require('multer');
const request_param = multer();

//authentication section of dashboard
namedRouter.all('/dashboard*', auth.authenticate);

namedRouter.get("dashboard.getallusercount", '/dashboard/getallusercount', async (req, res) => {
    try {
        const success = await userController.getAllUserCount(req, res);
        res.send({
            "data": success
        });
    } catch (error) {
        res.status(error.status).send(error);
    }
});






//Export the express.Router() instance
module.exports = router;