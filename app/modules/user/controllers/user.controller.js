const mongoose = require('mongoose');
const User = require('user/models/user.model');
const userRepo = require('user/repositories/user.repository');
const roleRepo = require('role/repositories/role.repository');
const followerRepo = require('userFollower/repositories/follower.repository');
const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const querystring = require('querystring');
const gm = require('gm').subClass({
    imageMagick: true
});
const fs = require('fs');
const jwt = require('jsonwebtoken');
//mail send 
const {
    join
} = require('path');
const ejs = require('ejs');
const {
    readFile
} = require('fs');
const {
    promisify
} = require('util');
const readFileAsync = promisify(readFile);
var request = require('request');

var client_id = '7db0c6e60cc54427acb6ebf08e297948'; // Your client id
var client_secret = '75e1f9e38e7540ac841536171d7f3344'; // Your secret
var redirect_uri = 'http://127.0.0.1:1431/admin/spotify/callback'; // Your redirect uri
var stateKey = 'spotify_auth_state';

class UserController {
    constructor() {
        this.users = [];

    }

    /* @Method: login
    // @Description: user Login Render
    */
    async login(req, res) {
        res.render('user/views/login.ejs');
    };

    /* @Method: signin
    // @Description: user Login
    */
    async signin(req, res) {
        try {
            let userData = await userRepo.fineOneWithRole(req.body);
            if (userData.status == 500) {
                req.flash('error', userData.message);
                return res.redirect(namedRouter.urlFor('user.login'));
            }
            let user = userData.data;
            if (!_.isEmpty(user.role) && user.role.role == 'admin') {
                const payload = {
                    id: user._id
                };

                let token = jwt.sign(payload, config.jwtSecret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                req.session.token = token;
                req.user = user;
                let user_details = {};
                user_details.id = user._id;
                user_details.name = user.name;
                user_details.email = user.email;
                // return the information including token as JSON
                req.flash('success', "You have successfully logged in");
                res.redirect(namedRouter.urlFor('user.dashboard'));
            } else {
                req.flash('error', 'Authentication failed. You are not a valid user.');
                res.redirect(namedRouter.urlFor('user.login'));
            }
        } catch (e) {
            throw e;
        }
    };

    /* @Method: create
    // @Description: user create view render
    */
    async create(req, res) {
        try {
            let success = {};
            let role = await roleRepo.getAll({});
            success.data = role;

            res.render('user/views/add.ejs', {
                page_name: 'user-management',
                page_title: 'User Create',
                user: req.user,
                response: success
            });
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    };

     /* @Method: insert
    // @Description: save User
    */
    async insert(req, res) {
        try {
            let roleDetails = await roleRepo.getByField({ role: "user" });
            if (!_.isEmpty(roleDetails)) {
                req.body.role = roleDetails._id;
            }
            const newUser = new User();

            req.body.password = newUser.generateHash(req.body.password);
                    
            var chk = { isDeleted: false, email: req.body.email };
            let checkEmail = await userRepo.getByField(chk);
            if (!_.isEmpty(checkEmail)) {
                req.flash('error', "Sorry, User already exist with this email.");
                res.redirect(namedRouter.urlFor('user.create'));
            }

            let SaveUser = await userRepo.save(req.body);
            req.flash('success', 'User created succesfully.');
            res.redirect(namedRouter.urlFor('user.listing'));
        } catch (e) {
            console.log(e.message);
            req.flash('error', e.message);
            //res.status(500).send({message: error.message});
            res.redirect(namedRouter.urlFor('user.create'));
        }
    };


    /* @Method: list
    // @Description: To get all the user from DB
    */
    async list(req, res) {
        try {
            res.render('user/views/list.ejs', {
                page_name: 'user-management',
                page_title: 'User List',
                user: req.user
            });
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    };


    /* @Method: getAllUser
    // @Description: To get all the user from DB
    */
    async getAllUser(req, res) {
        try {
            req.body.role = 'user';

            if (_.has(req.body, 'sort')) {
                var sortOrder = req.body.sort.sort;
                var sortField = req.body.sort.field;
            } else {
                var sortOrder = -1;
                var sortField = '_id';
            }

            if (!_.has(req.body, 'pagination')) {
                req.body.pagination.page = 1;
                eq.body.pagination.perpage = config.PAGINATION_PERPAGE
            }
            let user = await userRepo.getAllUsers(req);
            let meta = {
                "page": req.body.pagination.page,
                "pages": user.pageCount,
                "perpage": req.body.pagination.perpage,
                "total": user.totalCount,
                "sort": sortOrder,
                "field": sortField
            };

            return {
                status: 200,
                meta: meta,
                data: user.data,
                message: `Data fetched succesfully.`
            };
        } catch (e) {
            return {
                status: 500,
                data: [],
                message: e.message
            };
        }
    }

    /**
     * @Method: edit
     * @Description: To edit user information
     */
    async edit(req, res) {
        try {
            let result = {};
            let userData = await userRepo.getById(req.params.id);
            if (!_.isEmpty(userData)) {
                result.user_data = userData;
                res.render('user/views/edit.ejs', {
                    page_name: 'user-management',
                    page_title: 'User Edit',
                    user: req.user,
                    response: result
                });
            } else {
                req.flash('error', "Sorry user not found!");
                res.redirect(namedRouter.urlFor('user.listing'));
            }
        } catch (e) {
            throw e;
        }
    };


    async update(req, res) {
        try {

            var chkEmail = {
                isDeleted: false,
                email: req.body.email,
                _id: { $ne: mongoose.Types.ObjectId(req.body.uid) }
            };
            let checkEmail = await userRepo.getByField(chkEmail);
            if (!_.isEmpty(checkEmail)) {
                req.flash('error', "Email already exist.");
                res.redirect(namedRouter.urlFor('user.edit', {
                    id: req.body.uid
                }));
            }
            else{
                let userUpdate = userRepo.updateById(req.body, req.body.uid);
                if (userUpdate) {
                    req.flash('success', 'User updated succesfully.');
                    res.redirect(namedRouter.urlFor('user.listing'));
                } else {
                    res.redirect(namedRouter.urlFor('user.edit', {
                        id: req.body.uid
                    }));
                }
            }
            
        } catch (e) {
            throw e;
        }
    };

    /* @Method: delete
    // @Description: user Delete
    */
    async delete(req, res) {
        try {
            let userDelete = await userRepo.updateById({
                "isDeleted": true
            }, req.params.id)
            if (!_.isEmpty(userDelete)) {
                req.flash('success', 'User Removed Successfully');
                res.redirect(namedRouter.urlFor('user.listing'));
            }
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    };

    async generateRandomString(length) {
        try{        
            var text = '';
            var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        
            for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        }
        catch(e){
            console.log(e.message);
        }
    };

    async spotifyLogin(req,res){
        try{
            var text = '';
            var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            
            for (var i = 0; i < possible.length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            
            let state = text;//await this.generateRandomString(16);

            
            res.cookie(stateKey, state);
            
            var scope = 'user-read-private user-read-email';
            res.redirect('https://accounts.spotify.com/authorize?' +
                querystring.stringify({
                response_type: 'code',
                client_id: client_id,
                scope: scope,
                redirect_uri: redirect_uri,
                state: state
            }));            
        }
        catch(e){
            console.log(e.message);
            //throw (e);
            return res.status(500).send({ message: e.message });
        }
    }

    async spotifyCallback(req,res){
        try{
            let resultAll = {
                'display_name':'',
                'email':'',
            }
            if(!_.has(req.query,'code') || !_.has(req.query,'state')){
                res.redirect(namedRouter.urlFor('user.dashboard'));
            }
            var code = req.query.code || null;
            var state = req.query.state || null;
            var storedState = req.cookies ? req.cookies[stateKey] : null;

            if (state === null || state !== storedState) {
                //res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
                req.flash('error', "Sorry state mismatched");
                res.redirect(namedRouter.urlFor('user.spotify.callback'));
            } else {
                /*
                console.log('code['+code+']');
                spotifyApi.authorizationCodeGrant(code).then(function(data) {
                      console.log('The token expires in ' + data.body['expires_in']);
                      console.log('The access token is ' + data.body['access_token']);
                      console.log('The refresh token is ' + data.body['refresh_token']);
                  
                      // Set the access token on the API object to use it in later calls
                      spotifyApi.setAccessToken(data.body['access_token']);
                      spotifyApi.setRefreshToken(data.body['refresh_token']);
                    },
                    function(err) {
                      console.log('Something went wrong!', err);
                    }
                  );
                  */
                
                res.clearCookie(stateKey);
                var authOptions = {
                    url: 'https://accounts.spotify.com/api/token',
                    form: {
                        code: code,
                        redirect_uri: redirect_uri,
                        grant_type: 'authorization_code'
                    },
                    headers: {
                        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
                    },
                    json: true
                };
                
                                
                request.post(authOptions, function(error, response, body) {
                    if (!error && response.statusCode === 200) {
                        console.log(body);
                        spotifyApi.setAccessToken(body.access_token);

                        // spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
                        //     function(data) {
                        //       console.log('Artist albums', data.body);
                        //     },
                        //     function(err) {
                        //       console.error(err);
                        //     }
                        // );
                        console.log('spotify detail',body);
                        req.spotify = body;
                        res.redirect(namedRouter.urlFor('user.spotify.check'));

                        // var access_token = body.access_token,
                        //     refresh_token = body.refresh_token;

                        // var options = {
                        //     url: 'https://api.spotify.com/v1/me',
                        //     headers: { 'Authorization': 'Bearer ' + access_token },
                        //     json: true
                        // };

                        // use the access token to access the Spotify Web API
                        // request.get(options, function(error, response, body) {
                        //     resultAll.display_name = body.display_name;
                        //     resultAll.email = body.email;
                        //     // req.user.spotify_email = body.email;
                        //     res.render('user/views/spotify.ejs', {
                        //         page_name: 'user-dashboard',
                        //         page_title: 'Spotify Info',
                        //         user: req.user,
                        //         response: resultAll
                        //     });
                        // });
                       
                        
                    } else {

                        req.flash('error', "Invalid token");
                        res.redirect(namedRouter.urlFor('user.spotify.callback'));
                    }
                });
                
            }
        }
        catch(e){
            console.log(e.message);
        }
    }

    async spotifyCheck(req, res){
        try{
            
            spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
                function(data) {
                    console.log('Artist albums', data.body);
                },
                function(err) {
                    console.error(err);
                }
            );
            var options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };
            request.get(options, function(error, response, body) {
                    resultAll.display_name = body.display_name;
                    resultAll.email = body.email;
                    // req.user.spotify_email = body.email;
                    res.render('user/views/spotify.ejs', {
                        page_name: 'user-dashboard',
                        page_title: 'Spotify Info',
                        user: req.user,
                        response: resultAll
                    });
                });
        }
        catch(e){

        }
    }

    /* @Method: Dashboard
    // @Description: User Dashboard
    */
    async dashboard(req, res) {

        try {
            
            let user = await userRepo.getLimitUserByField({ 'isDeleted': false, 'role.role': 'admin' });
            let resultAll = {
                'user' : user,
                'totalUserCount':0,
                'activeUserCount':0
            }

            let roleUser = await roleRepo.getByField({ "role": "user" });

            // User Summary
            let totalUserCount = await userRepo.getUserCountByParam({ "isDeleted": false, "role": mongoose.Types.ObjectId(roleUser._id) });
            if(totalUserCount!=null && totalUserCount!=0){
                resultAll.totalUserCount = totalUserCount;
            }
            
            let activeUserCount = await userRepo.getUserCountByParam({ "isActive":true,"isDeleted": false, "role": mongoose.Types.ObjectId(roleUser._id) });
            if(activeUserCount!=null && activeUserCount!=0){
                resultAll.activeUserCount = activeUserCount;
            }
            
            /* Html render here */
            res.render('user/views/dashboard.ejs', {
                page_name: 'user-dashboard',
                page_title: 'Dashboard',
                user: req.user,
                response: resultAll                
            });

        } catch (e) {
            console.log(e.message);
            //throw (e);
            return res.status(500).send({ message: e.message });
        }
    };

    

    /* @Method: Logout
    // @Description: User Logout
    */
    async logout(req, res) {
        req.session.destroy(function (err) {
            res.redirect('/' + process.env.ADMIN_FOLDER_NAME);
        });
        // req.session.token = "";
        // req.session.destroy();
        // return res.redirect('/');
    };

    /* @Method: viewmyprofile
    // @Description: To get Profile Info from db
    */
    async viewmyprofile(req, res) {
        try {
            const id = req.params.id;
            let user = await userRepo.getById(id)
            if (!_.isEmpty(user)) {
                res.render('user/views/myprofile.ejs', {
                    page_name: 'user-profile',
                    page_title: 'My Profile',
                    user: req.user,
                    response: user
                });

            }
        } catch (e) {

            return res.status(500).send({
                message: e.message
            });
        }
    }

    /* @Method: updateprofile
    // @Description: Update My Profile 
    */
    async updateprofile(req, res) {
        try {
            const id = req.body.id;
            let userUpdate = await userRepo.updateById(req.body, id)
            if (!_.isEmpty(userUpdate)) {
                req.flash('success', "Profile updated successfully.");
                res.redirect(namedRouter.urlFor('admin.profile', {
                    id: id
                }));
            }
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    };

    /*
    // @Method: status_change
    // @Description: User status change action
    */
    async statusChange(req, res) {
        try {            
            let user = await userRepo.getById(req.params.id);            
            if (!_.isEmpty(user)) {
                let userStatus = (user.isActive == true) ? false : true;
                let userUpdate = userRepo.updateById({
                    'isActive': userStatus
                }, req.params.id);
                req.flash('success', "User status has changed successfully.");
                res.redirect(namedRouter.urlFor('user.listing'));
            } else {
                req.flash('error', "Sorry user not found");
                res.redirect(namedRouter.urlFor('user.listing'));
            }
        } catch (e) {
            console.log(e.message);
            return res.status(500).send({
                message: e.message
            });
        }
    };

    
    /* @Method: changepassword
    // @Description: user changepassword Render
    */
    async adminChangePassword(req, res) {
        var vehicleOwner = await userRepo.getById(req.user._id);
        if (vehicleOwner) {
            res.render('user/views/change_password.ejs', {
                page_name: 'user-changepassword',
                page_title: 'Change Password',
                response: vehicleOwner,
                user: req.user
            });
        } else {
            req.flash('error', "sorry vehicle owner not found.");
            res.redirect(namedRouter.urlFor('user.dashboard'));
        }

    };

    /*
    // @Method: updatepassword
    // @Description: User password change
    */

    async adminUpdatePassword(req, res) {
        try {
            let user = await userRepo.getById(req.user._id);
            if (!_.isEmpty(user)) {
                // check if password matches
                if (!user.validPassword(req.body.old_password, user.password)) {
                    req.flash('error', "Sorry old password mismatch!");
                    res.redirect(namedRouter.urlFor('admin.changepassword'));
                } else {
                    if (req.body.password == req.body.password_confirm) {
                        // if user is found and password is right, check if he is an admin
                        let new_password = req.user.generateHash(req.body.password);
                        let userUpdate = await userRepo.updateById({
                            "password": new_password
                        }, req.body.id);

                        if (userUpdate) {
                            req.flash('success', "Your password has been changed successfully.");
                            res.redirect(namedRouter.urlFor('user.dashboard'));
                        }
                    } else {
                        req.flash('error', "Your New Password And Confirm Password does not match.");
                        res.redirect(namedRouter.urlFor('admin.changepassword'));
                    }

                }
            } else {
                req.flash('error', "Authentication failed. Wrong credentials.");
                res.redirect(namedRouter.urlFor('admin.changepassword'));
            }
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    };

    /*
    // @Method: forgotPassword
    // @Description: User forgotPassword
    */

    async forgotPassword(req, res) {

        try {
            let roleDetails = await roleRepo.getByField({ role: "admin" });
            let result = {};
            let user = await User.findOne({ email: req.body.email, role: mongoose.Types.ObjectId(roleDetails._id) }).exec();
            if (!user) {
                result.status=500;
                return res.status(201).send({ "result": result, "message": "User not found", "status": false });
            }
            else{
                let random_pass = Math.random().toString(36).substr(2, 9);
                let readable_pass = random_pass;
                random_pass = user.generateHash(random_pass);
                let user_details = await User.findByIdAndUpdate(user._id, { password: random_pass }).exec();
                if (!user_details) {
                    result.status=500;
                    return res.status(201).send({ "result": result, "message": "User not found", "status": false });
                }
                else {
                    var mailOptions = {
                        from: `Choona Admin<${process.env.MAIL_USERNAME}>`,
                        to: req.body.email,
                        subject: "Forget Password",
                        html: 'Hello ' + '<b>' + user.full_name + '</b>' + ',<br><br>We have received a request to reset your password.<br><br>Here is your new password: <span><b>' + readable_pass + '</b></span><br><br>Thank You'
                    };
                    let sendMail = await transporter.sendMail(mailOptions);
                    if (sendMail) {
                        result.status=200;
                        return res.status(200).send({ "result": result, "message": "Mail is sending to your mail id with new password", "status": false });
                    }
                }
            }            
        }
        catch (e) {
            console.log(e.message);
            return res.status(500).send({ message: e.message });
        }
    };


    async getAllUserCount(req, res) {
        try {
            let userCount = await userRepo.getUsersCount(req);
            return userCount;
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    };   

    /* @Method: userFollowlist
    // @Description: To get all the followers byuser from DB
    */
   async userFollowlist(req, res) {
    try {
        let user_id = req.params.id
        res.render('user/views/userfollowlist.ejs', {
            page_name: 'user-management',
            page_title: 'User Follower List',
            user: req.user,
            id:user_id
        });
    } catch (e) {
        return res.status(500).send({
            message: e.message
        });
    }
};

/* @Method: userFollowlist
    // @Description: To get all the followers byuser from DB
    */
   async getAllFollowersByUser(req, res) {
    try {
        let followerList = await followerRepo.followerList(req);
        if (_.has(req.body, 'sort')) {
            var sortOrder = req.body.sort.sort;
            var sortField = req.body.sort.field;
        } else {
            var sortOrder = -1;
            var sortField = '_id';
        }
        let meta = { "page": req.body.pagination.page, "pages": followerList.pageCount, "perpage": req.body.pagination.perpage, "total": followerList.totalCount, "sort": sortOrder, "field": sortField };
        return { status: 200, meta: meta, data: followerList.data, message: `Data fetched succesfully.` };
    } catch (e) {
        return res.status(500).send({
            message: e.message
        });
    }
};

/* @Method: userFollowlist
    // @Description: To get all the followers byuser from DB
    */
   async userFollowinglist(req, res) {
    try {
        let user_id = req.params.id
        res.render('user/views/userfollowinglist.ejs', {
            page_name: 'user-management',
            page_title: 'User Following List',
            user: req.user,
            id:user_id
        });
    } catch (e) {
        return res.status(500).send({
            message: e.message
        });
    }
};

/* @Method: userFollowlist
    // @Description: To get all the followers byuser from DB
    */
   async getAllFollowingByUser(req, res) {
    try {
        let followingList = await followerRepo.followinglist(req);
        if (_.has(req.body, 'sort')) {
            var sortOrder = req.body.sort.sort;
            var sortField = req.body.sort.field;
        } else {
            var sortOrder = -1;
            var sortField = '_id';
        }
        let meta = { "page": req.body.pagination.page, "pages": followingList.pageCount, "perpage": req.body.pagination.perpage, "total": followingList.totalCount, "sort": sortOrder, "field": sortField };
        return { status: 200, meta: meta, data: followingList.data, message: `Data fetched succesfully.` };
    } catch (e) {
        return res.status(500).send({
            message: e.message
        });
    }
};


}

module.exports = new UserController();