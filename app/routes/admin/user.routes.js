const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const querystring = require('querystring');
const multer = require('multer');
const userController = require('user/controllers/user.controller');

const Storage = multer.diskStorage({
	destination: (req, file, callback) => {
		if (file.fieldname.match('image') != null) {
			callback(null, "./public/uploads/jobseeker/profile_pic")
		}
		else if (file.fieldname === 'jobseeker_file_cv') {
			callback(null, "./public/uploads/jobseeker/cv")
		}
		else {
			callback(null, "./public/uploads");
		}

	},
	filename: (req, file, callback) => {
		callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
	}
});

const uploadFile = multer({
	storage: Storage
});
const request_param = multer();

// 

// login render route
namedRouter.get('user.login', '/', userController.login);

// login process route
namedRouter.post("user.login.process", '/login', userController.signin);
// namedRouter.post("user.login.process", '/login', async (req, res) => {
// 	try {
// 		const success = await userController.signin(req);
// 		req.flash('success', success.message);
// 		var sess;
// 		sess = req.session;
// 		sess.email = req.body.email;
// 		res.end('done');
// 		// return res.redirect(namedRouter.urlFor('user.login'));
// 	} catch (error) {
// 		req.flash('error', error.message);
// 		// return res.redirect(namedRouter.urlFor('user.login'));
// 	}
// });



/*
// @Route: Users Forgotpassowrd [Admin]
*/
namedRouter.post('admin.user.forgotPassword', '/user/forgotpassword', request_param.any(), userController.forgotPassword);

namedRouter.get('user.logout', "/logout", userController.logout);
namedRouter.all('/*', auth.authenticate);

/*
// @Route: Users Dashboard [Admin]
*/
// dashboard route
namedRouter.get("user.dashboard", '/dashboard', userController.dashboard);

namedRouter.get('user.spotify.login', '/spotify/login', userController.spotifyLogin);

namedRouter.get('user.spotify.callback', '/spotify/callback', userController.spotifyCallback);

namedRouter.get('user.spotify.check', '/spotify/check', userController.spotifyCheck);

namedRouter.get("admin.profile", '/profile/:id', request_param.any(), userController.viewmyprofile);

// admin update profile
namedRouter.post("admin.updateProfile", '/update/profile', request_param.any(), userController.updateprofile);

// admin change Password
namedRouter.get("admin.changepassword", '/change/password', userController.adminChangePassword);

/*
// @Route: Chnage password [Admin] action
*/
namedRouter.post("admin.updateAdminPassword", '/update/admin-password', request_param.any(), userController.adminUpdatePassword);

// User List
namedRouter.get("user.listing", '/user/listing', userController.list);

// Get All Users
namedRouter.post("user.getall", '/user/getall', async (req, res) => {
	try {
		const success = await userController.getAllUser(req, res);
		res.send({
			"meta": success.meta,
			"data": success.data
		});
	} catch (error) {
		res.status(error.status).send(error);
	}
});


// Get All Jobseeker
namedRouter.post("user.getall.jobseeker", '/user/jobseeker/getall', async (req, res) => {
	try {
		const success = await userController.getAllJobseeker(req, res);
		res.send({
			"meta": success.meta,
			"data": success.data
		});
	} catch (error) {
		res.status(error.status).send(error);
	}
});

namedRouter.get("user.create", '/user/create', userController.create);

namedRouter.post("user.insert", '/user/insert', request_param.any(), userController.insert);


// User Edit Route
namedRouter.get("user.edit", "/user/edit/:id", userController.edit);

// User Update Route
namedRouter.post("user.update", '/user/update', request_param.any(), userController.update);

// User Delete Route
namedRouter.get("user.delete", "/user/delete/:id", userController.delete);

namedRouter.get("user.statusChange", '/user/status-change/:id',request_param.any(), userController.statusChange);

// Get All Follower list by Users
namedRouter.post("user.follow-getall", '/user/follow-getall', async (req, res) => {
	try {
		const success = await userController.getAllFollowersByUser(req, res);
		res.send({
			"meta": success.meta,
			"data": success.data
		});
	} catch (error) {
		res.status(error.status).send(error);
	}
});
// Follower list by Users
namedRouter.get("user.follow-listing", '/user/follow-listing/:id', userController.userFollowlist);

// Get All Following list by Users
namedRouter.post("user.following-getall", '/user/following-getall', async (req, res) => {
	try {
		const success = await userController.getAllFollowingByUser(req, res);
		res.send({
			"meta": success.meta,
			"data": success.data
		});
	} catch (error) {
		res.status(error.status).send(error);
	}
});
// Following list by Users
namedRouter.get("user.following-listing", '/user/following-listing/:id', userController.userFollowinglist);

// Export the express.Router() instance
module.exports = router;