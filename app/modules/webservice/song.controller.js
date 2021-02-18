const mongoose = require("mongoose");
const songRepo = require('song/repositories/song.repository');
const express = require("express");
const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);
const querystring = require("querystring");
var { getData, getPreview } = require("spotify-url-info");
var spotifyUrlInfo = require("spotify-url-info")


// var geocoder = NodeGeocoder(options);

class songController {
	constructor() { }

	async list(req) {
		try {

			const list = await songRepo.getAllByField({ user_id: req.user._id });

			if (!_.isEmpty(list)) {
				return { status: 200, data: list, message: 'Your song fecthed successfully.' };
			} else {
				return { status: 201, data: [], message: 'No song found' };
			}
		} catch (e) {
			return { status: 500, data: [], message: e.message };
		}
	}

	async store(req) {
		try {
			req.body.user_id = req.user._id

			if (req.body.user_id) {
				if (!_.isEmpty(req.body.chat_id) && req.body.type == 'chat') {
					var song = await songRepo.getByField({ user_id: req.body.user_id, chat_id: req.body.chat_id });
				} else {
					var song = await songRepo.getByField({ user_id: req.body.user_id, post_id: req.body.post_id });
				}

				if (!_.isEmpty(song)) {
					return { status: 201, data: [], message: 'Song already saved.' };
				} else {
					const songStore = await songRepo.save(req.body);
					return { status: 200, data: songStore, message: 'Your song saved successfully.' };
				}
			} else {
				return { status: 201, data: [], message: 'Somethig went wrong.' };
			}


		} catch (e) {
			return { status: 500, data: [], message: e.message };
		}
	}

	async saveSent(req) {
		try {
			const songSentStore = await songRepo.saveSent({ shared_user_id: req.body.shared_user_id, song_id: req.body.song_id, user_id: req.user._id });
			if (!_.isEmpty(songSentStore)) {
				return { status: 200, data: songSentStore, message: 'Your song shared successfully.' };
			} else {
				return { status: 201, data: [], message: 'Something went wrong.' };
			}
		} catch (e) {
			return { status: 500, data: [], message: e.message };
		}
	}

	async remove(req) {
		try {

			const songRemove = await songRepo.deleteByParam({ _id: req.params.id });

			if (!_.isEmpty(songRemove)) {
				return { status: 200, data: songRemove, message: 'Your song removed successfully.' };
			} else {
				return { status: 201, data: [], message: 'Something went wrong.' };
			}
		} catch (e) {
			return { status: 500, data: [], message: e.message };
		}
	}


	async search(req) {
		try {
			/*let query = {
							user_id:req.user._id,
							'isActive':true,
							song_name:{'$regex' :req.body.keyword, '$options' : 'i'},
						}*/
			let query = {
				$or: [
					{ "song_name": { '$regex': req.body.keyword, '$options': 'i' } },
					{ "artist_name": { '$regex': req.body.keyword, '$options': 'i' } },
				],
				user_id: req.user._id,
				'isActive': true,
			}

			const data = await songRepo.getAllByField(query);
			if (!_.isEmpty(data)) {
				return { status: 200, data: data, "message": "Song fetched successfully." };
			} else {
				return { status: 201, data: [], "message": "No song found" };
			}
		} catch (e) {
			return { status: 500, data: [], message: e.message };
		}
	}

	async dataSpoity(req) {
		try {
			const data = await getPreview("https://open.spotify.com/track/" + req.params.id);
			//const data = await getPreview("https://open.spotify.com/track/527k23H0A4Q0UJN3vGs0Da");
			//console.log(' <><> ', data);
			if (!_.isEmpty(data)) {
				return { status: 200, data: data, "message": "Song fetched successfully." };
			} else {
				return { status: 201, data: [], "message": "No song found" };
			}
		} catch (e) {
			console.log(e);
			return { status: 500, data: [], message: e.message };
		}
	}



}

module.exports = new songController();
