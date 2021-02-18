const mongoose = require("mongoose");
const countryCodeRepo = require('countryCode/repositories/countryCode.repository');
const express = require("express");
const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);


class countryCodeController {
	constructor() { }
    
    /* 
    // @Method: List
    // @Description: country code list
    */
	async list(req) {
		try {
			
			const countryCodes = await countryCodeRepo.getAllByField({},{dial_code:1});
			if (!_.isEmpty(countryCodes)) {
				
				return { status: 200, data: countryCodes, message: 'Your countryCodes fetched successfully.' };
			}else {
				return { status: 201, data:[], message: 'no data found.' };
			}
		}catch (e) {
			return { status: 500, data: [], message: e.message };
		}
    }
    
    
	
}

module.exports = new countryCodeController();
