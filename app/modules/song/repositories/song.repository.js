const mongoose = require('mongoose');
const Song = require('song/models/song.model');
const SongSent = require('song/models/song_sent.model');
const perPage = config.PAGINATION_PERPAGE;
var moment = require('moment');

const songRepository = {
    
    getById: async (id) => {
        try {
            let songs = await Song.findById(id).exec();
            if (!songs) {
                return null;
            }
            return songs;

        } catch (e) {
            return e;
        }
    },

    getByField: async (params) => {

        try {
            let songs = await Song.findOne(params).exec();
            if (!songs) {
                return null;
            }
            return songs;

        } catch (e) {
            return e;
        }
    },

    getAllByField: async (params) => {
        try {
            let songs = await Song.find(params).sort({_id:-1}).exec();
            if (!songs) {
                return null;
            }
            return songs;

        } catch (e) {
            return e;
        }
    },

    

    deleteByParam: async (param) => {
        try {
            let songs = await Song.deleteOne(param);
            if (!songs) {
                return null;
            }
            return songs;
        } catch (e) {
            return e;
        }
    },

    deleteByField: async (field, fieldValue) => {
        //todo: Implement delete by field
    },


   
   

    save: async (data) => {
        try {
            let songs = await Song.create(data);
            if (!songs) {
                return null;
            }
            return songs;
        } catch (e) {
            return e;
        }
    },

    saveSent: async (data) => {
        try {
            let songssent = await SongSent.create(data);
            if (!songssent) {
                return null;
            }
            return songssent;
        } catch (e) {
            return e;
        }
    },


};

module.exports = songRepository;