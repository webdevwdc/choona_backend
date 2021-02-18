const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const multer = require('multer');
const request_param = multer();
const countryCodeController = require('webservice/countryCode.controller');




/**
 * @api {get} /country-code/list  Country Code List
 
 * @apiGroup Country Code
 * @apiSuccessExample {json} Success
 *{
    "status": 200,
    "data": [
        {
            "name": "Canada",
            "dial_code": "+1",
            "code": "CA",
            "flag": "🇨🇦",
            "isActive": true,
            "_id": "5f2be241f4469110c871fbeb",
            "createdAt": "2020-08-06T11:34:02.031Z"
        },
        {
            "name": "United States",
            "dial_code": "+1",
            "code": "US",
            "flag": "🇺🇸",
            "isActive": true,
            "_id": "5f2be247f4469110c871fdfc",
            "createdAt": "2020-08-06T11:34:02.032Z"
        },
        {
            "name": "Bahamas",
            "dial_code": "+1242",
            "code": "BS",
            "flag": "🇧🇸",
            "isActive": true,
            "_id": "5f2be240f4469110c871fbaf",
            "createdAt": "2020-08-06T11:34:02.032Z"
        },
        {
            "name": "Barbados",
            "dial_code": "+1246",
            "code": "BB",
            "flag": "🇧🇧",
            "isActive": true,
            "_id": "5f2be241f4469110c871fbb9",
            "createdAt": "2020-08-06T11:34:02.032Z"
        },
        {
            "name": "Anguilla",
            "dial_code": "+1264",
            "code": "AI",
            "flag": "🇦🇮",
            "isActive": true,
            "_id": "5f2be240f4469110c871fb96",
            "createdAt": "2020-08-06T11:34:02.032Z"
        },
        {
            "name": "Antigua and Barbuda",
            "dial_code": "+1268",
            "code": "AG",
            "flag": "🇦🇬",
            "isActive": true,
            "_id": "5f2be240f4469110c871fb9a",
            "createdAt": "2020-08-06T11:34:02.032Z"
        },
        {
            "name": "Virgin Islands, British",
            "dial_code": "+1284",
            "code": "VG",
            "flag": "🇻🇬",
            "isActive": true,
            "_id": "5f2be249f4469110c871feb4",
            "createdAt": "2020-08-06T11:34:02.032Z"
        },
        {
            "name": "Virgin Islands, U.S.",
            "dial_code": "+1340",
            "code": "VI",
            "flag": "🇻🇮",
            "isActive": true,
            "_id": "5f2be249f4469110c871feb7",
            "createdAt": "2020-08-06T11:34:02.032Z"
        },
        {
            "name": "Bermuda",
            "dial_code": "+1441",
            "code": "BM",
            "flag": "🇧🇲",
            "isActive": true,
            "_id": "5f2be241f4469110c871fbc8",
            "createdAt": "2020-08-06T11:34:02.033Z"
        },
        {
            "name": "Grenada",
            "dial_code": "+1473",
            "code": "GD",
            "flag": "🇬🇩",
            "isActive": true,
            "_id": "5f2be243f4469110c871fc8a",
            "createdAt": "2020-08-06T11:34:02.033Z"
        },
        {
            "name": "Turks and Caicos Islands",
            "dial_code": "+1649",
            "code": "TC",
            "flag": "🇹🇨",
            "isActive": true,
            "_id": "5f2be247f4469110c871fdea",
            "createdAt": "2020-08-06T11:34:02.033Z"
        },
        {
            "name": "Montserrat",
            "dial_code": "+1664",
            "code": "MS",
            "flag": "🇲🇸",
            "isActive": true,
            "_id": "5f2be245f4469110c871fd1f",
            "createdAt": "2020-08-06T11:34:02.033Z"
        },
        {
            "name": "Northern Mariana Islands",
            "dial_code": "+1670",
            "code": "MP",
            "flag": "🇲🇵",
            "isActive": true,
            "_id": "5f2be245f4469110c871fd4e",
            "createdAt": "2020-08-06T11:34:02.033Z"
        },
        {
            "name": "Guam",
            "dial_code": "+1671",
            "code": "GU",
            "flag": "🇬🇺",
            "isActive": true,
            "_id": "5f2be243f4469110c871fc90",
            "createdAt": "2020-08-06T11:34:02.033Z"
        },
        {
            "name": "AmericanSamoa",
            "dial_code": "+1684",
            "code": "AS",
            "flag": "🇦🇸",
            "isActive": true,
            "_id": "5f2be240f4469110c871fb8c",
            "createdAt": "2020-08-06T11:34:02.033Z"
        },
        {
            "name": "Saint Lucia",
            "dial_code": "+1758",
            "code": "LC",
            "flag": "🇱🇨",
            "isActive": true,
            "_id": "5f2be249f4469110c871fe8a",
            "createdAt": "2020-08-06T11:34:02.033Z"
        },
        {
            "name": "Dominica",
            "dial_code": "+1767",
            "code": "DM",
            "flag": "🇩🇲",
            "isActive": true,
            "_id": "5f2be242f4469110c871fc26",
            "createdAt": "2020-08-06T11:34:02.034Z"
        },
        {
            "name": "Saint Vincent and the Grenadines",
            "dial_code": "+1784",
            "code": "VC",
            "flag": "🇻🇨",
            "isActive": true,
            "_id": "5f2be249f4469110c871fe93",
            "createdAt": "2020-08-06T11:34:02.034Z"
        },
        {
            "name": "Dominican Republic",
            "dial_code": "+1849",
            "code": "DO",
            "flag": "🇩🇴",
            "isActive": true,
            "_id": "5f2be242f4469110c871fc29",
            "createdAt": "2020-08-06T11:34:02.034Z"
        },
        {
            "name": "Trinidad and Tobago",
            "dial_code": "+1868",
            "code": "TT",
            "flag": "🇹🇹",
            "isActive": true,
            "_id": "5f2be247f4469110c871fdde",
            "createdAt": "2020-08-06T11:34:02.034Z"
        },
        {
            "name": "Saint Kitts and Nevis",
            "dial_code": "+1869",
            "code": "KN",
            "flag": "🇰🇳",
            "isActive": true,
            "_id": "5f2be248f4469110c871fe87",
            "createdAt": "2020-08-06T11:34:02.034Z"
        },
        {
            "name": "Jamaica",
            "dial_code": "+1876",
            "code": "JM",
            "flag": "🇯🇲",
            "isActive": true,
            "_id": "5f2be244f4469110c871fcc0",
            "createdAt": "2020-08-06T11:34:02.034Z"
        },
        {
            "name": "Puerto Rico",
            "dial_code": "+1939",
            "code": "PR",
            "flag": "🇵🇷",
            "isActive": true,
            "_id": "5f2be246f4469110c871fd73",
            "createdAt": "2020-08-06T11:34:02.034Z"
        }
    ],
    "message": "Your countryCodes fetched successfully."
}
*/

namedRouter.get("api.countryCode.list", '/country-code/list', request_param.any(), async (req, res) => {
    try {
        const success = await countryCodeController.list(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});


module.exports = router;