//controller methods
var encrypt_util = require('./../util/encrypt_util.js')
var redis = require('redis');
var client = redis.createClient();

//phrase같아. {~~} 전체 가지고와
module.exports = {
	main: function (request, response) {
		var decrypted = encrypt_util.decrypt(request.cookies['auth_token']);
		if (!decrypted) {
			response.redirect('/index.html');
			return;
		}
		client.get(decrypted, function (err, userInfo) {
			if (!userInfo) {
				response.redirect('/index.html');
				return;
			} else {
					response.redirect('/login');
			}
		});
	},

	index: function (request, response) {
		var decrypted = encrypt_util.decrypt(request.cookies['auth_token']);
		if (!decrypted) {
			response.redirect('/index.html');
			return;
		}
		client.get(decrypted, function (err, userInfo) {
			if (!userInfo) {
				response.redirect('/index.html');
				return;
			} else {
				response.redirect('/main.html');
			}
		});
	},

	signup: function (request, response) {
		// TODO : Username already exists message needs to be there
		// behavior: store the user info into the DB, and redirect to login page
		var userInfo = request.body;
		var kg = parseInt(userInfo.current_weight) / 2.2046226218;
		var cm = ((parseInt(userInfo.height) * 12) + parseInt(userInfo.height_in)) * 2.54;
		var age = parseInt(userInfo.age);
		var bmr = (9.99 * kg) + (6.25 * cm) - (4.92 * age);
		if (userInfo.gender === "male") {
			bmr += 5;
		}
		else {
			bmr -= 161;
		}
		bmr *= userInfo.activity_lvl;
		userInfo.daily_cal = bmr - (parseInt(userInfo.current_weight) - parseInt(userInfo.goal_weight)) * 3500 / parseInt(userInfo.goaldate);
		client.set(userInfo.username, JSON.stringify(request.body));
		response.redirect('/login.html');
	},
	login: function (request, response) {
		// TODO
		// behavior: Authenticate the user by matching the username/password pair in the DB, and
            	//	-> if the user is authenticated, generate an authenticated token and set the cookie with an authenticated token
            	//	-> if the user is not authenticated, redirect to login page and show error.

		client.get(request.body.username, function(err, userInfo) {
				userInfo = JSON.parse(userInfo);
				if (userInfo === null) {
					response.redirect('/');
					return;
				}
				var password = userInfo.password;
				if (request.body.password === password) {
					// set the authenticated token
					// make this more secure using encryption
					var encrypted = encrypt_util.encrypt(request.body.username);
					response.cookie('auth_token', encrypted);
					response.redirect('/main.html');
				} else {
					response.redirect('/');
				}
		});
	},

	logout: function (request, response) {
		response.clearCookie('auth_token', { path: '/' });

		response.redirect('/');
	},

	getUserInfo: function (request, response) {
		var auth_token = request.cookies['auth_token'];
		if (!auth_token) {
			// do something
			response.send("You are not logged in!");
			return;
		}
		var decrypted = encrypt_util.decrypt(auth_token);
		client.get(decrypted, function (err, userInfo) {
				userInfo = JSON.parse(userInfo);
				if (userInfo === null) {
					response.redirect('/');
					return;
				} else {
					response.json(userInfo);
				}
		});
	}
};
