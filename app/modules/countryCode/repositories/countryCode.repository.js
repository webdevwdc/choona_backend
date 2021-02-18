const mongoose = require('mongoose');
const CountryCode = require('countryCode/models/countryCode.model');

const perPage = config.PAGINATION_PERPAGE;
var moment = require('moment');

const countryCodeRepository = {
    
    getById: async (id) => {
        try {
            let data = await CountryCode.findById(id).exec();
            if (!data) {
                return null;
            }
            return data;

        } catch (e) {
            return e;
        }
    },

    getByField: async (params) => {

        try {
            let data = await CountryCode.findOne(params).exec();
            if (!data) {
                return null;
            }
            return data;

        } catch (e) {
            return e;
        }
    },

    getAllByField: async (params,sort) => {
        try {
            let data = await CountryCode.find(params).sort(sort).exec();
            if (!data) {
                return null;
            }
            return data;

        } catch (e) {
            return e;
        }
    },

    

    deleteByParam: async (param) => {
        try {
            let data = await CountryCode.deleteOne(param);
            if (!data) {
                return null;
            }
            return data;
        } catch (e) {
            return e;
        }
    },

    deleteByField: async (field, fieldValue) => {
        //todo: Implement delete by field
    },


   
   

    save: async (data) => {
        try {
            let data = await CountryCode.create(data);
            if (!data) {
                return null;
            }
            return data;
        } catch (e) {
            return e;
        }
    },
};

module.exports = countryCodeRepository;