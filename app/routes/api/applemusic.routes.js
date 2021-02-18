const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const multer = require('multer');
const request_param = multer();
const applemusicController = require('webservice/applemusic.controller');




/**
 * @api {get} /applemusic/token  Token applemusic
 
 * @apiGroup Activity
 * @apiSuccessExample {json} Success
 *{
    "status": 200,
    "token": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjdYR01CU1VaN0gifQ.eyJpYXQiOjE1ODk4OTYzODEsImV4cCI6MTU4OTg5OTk4MSwiaXNzIjoiSDIzVzNFRVJMSyJ9.cCxZTKN1Rb56-M0JoAkl3R9TZwoq7Tl05YVRrg-G68CVMSNB_xE93wGBWvhRaIoDQ1FRgtS_9JCo2jj2o8VjIA",
    "token_exp": "2020-05-19T14:53:01.891Z",
    "message": "Success"
}
*/

namedRouter.get("api.applemusic.token", '/applemusic/token', request_param.any(), async (req, res) => {
  try {
    const success = await applemusicController.getAppleMusicToken(req, res);
    res.status(success.status).send(success);
  } catch (error) {
    res.status(error.status).send(error);
  }
});


module.exports = router;