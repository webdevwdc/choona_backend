"use strict";
const fs = require("fs");
const jwt = require("jsonwebtoken");
const cfg = require("../../config.js");


/* 
// @Method: getSettingBySlug
// @Description: Get Setting data By Slug
*/
exports.getAppleMusicToken = async req => {
    try {

        const privateKey = fs.readFileSync("./public/AuthKey_KJ7DJB3768.p8").toString();
        
        const teamId = cfg.ios_teamId; 

        const jwtToken = jwt.sign({}, privateKey, {
            algorithm: "ES256",
            expiresIn: "160d",
            issuer: teamId,
            header: {
                alg: "ES256",
                kid: 'KJ7DJB3768'
            }
        });

        var dt = new Date();
        //dt.setHours(dt.getHours() + 1);
        dt.setHours(dt.getHours() + 3500);

        // console.log(jwtToken);

        if (jwtToken) {

            return { status: 200, token: jwtToken, token_exp: dt, message: 'Success' };
        } else {
            return { status: 201, data: [], message: 'No Data Found' };
        }
    } catch (error) {
        return { "status": 500, data: {}, "message": error.message }
    }
};