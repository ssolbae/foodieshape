//controller methods
var encrypt_util = require('./../util/encrypt_util.js')
var redis = require('redis');
var client = redis.createClient();

//phrase같아. {~~} 전체 가지고와
module.exports = {
	signup: function (request, response) {
		// TODO : Username already exists message needs ot be there
		// behavior: store the user info into the DB, and redirect to login page
		client.set(request.body.username, JSON.stringify(request.body));
		response.redirect('/login.html');
	},
	login: function (request, response) {
		// TODO
		// behavior: Authenticate the user by matching the username/password pair in the DB, and
            	//	-> if the user is authenticated, generate an authenticated token and set the cookie with an authenticated token
            	//	-> if the user is not authenticated, redirect to login page and show error.

		client.get(request.body.username, function(err, userInfo) {
				console.log(userInfo);
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

	getUserInfo: function (request, response) {
		var auth_token = request.cookies['auth_token'];
		console.log(auth_token);
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
