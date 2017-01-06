//controller for getting food APIs
var req = require('request');
var redis = require('redis');
var encrypt_util = require('./../util/encrypt_util.js')
var client = redis.createClient();
var async = require('async');
var APP_ID = "PUT YOUR APP ID HERE";
var APP_KEY = "PUT YOUR APP KEY HERE";

module.exports = {
	getCalorie: function (request, response) {
		// TODO
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
		console.log(userInfo.gender);


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
		var daily_cal = bmr - (parseInt(userInfo.current_weight) - parseInt(userInfo.goal_weight)) * 3500 / parseInt(userInfo.goaldate);
		var cal_each = [(daily_cal/3)-50, (daily_cal/3), (daily_cal/3)+50];

		var data_to_send = [];

		// populate data_to_send here
		for (var j = 0; j < 3; j++) {
		}
		var fxns = [];
		for (var i = 0; i < 3; i++) {
			var cal_lower  = Math.floor(cal_each[i]) - 50;
			var cal_upper = Math.floor(cal_each[i]) + 50;
			(function () {
				//url is eg of closure
				var url = "https://api.edamam.com/search?q=healthy&app_id=" + APP_ID + "&app_key=" + APP_KEY + "&from=0&to=" + 1 + "&calories=gte%20" + cal_lower + "%2C%20lte%20" + cal_upper + "&health=alcohol-free";

				var task = function (done) {
					req(url, function (err, resp, body) {
						if (err) {
							// response.json(err); --> can't be this bc response.json can happen 2x; pass err to done
							done(err);
							return;
						} else {
							var data = JSON.parse(body);
							console.log("datassss: " + data);
							var tmp = {};
							tmp.url = data.hits[0].recipe.url;
							tmp.image = data.hits[0].recipe.image;
							tmp.label = data.hits[0].recipe.label;
							tmp.calories = (data.hits[0].recipe.calories / data.hits[0].recipe.totalWeight)*500;
							data_to_send.push(tmp);
							done();
						}
					});
				};
				fxns.push(task);
			})();
		}
		async.parallel(fxns, function (err, data) {
			response.json(data_to_send);
		});
	});
	},


	getRecipes: function (request, response) {
		// TODO
		var decrypted = encrypt_util.decrypt(request.cookies['auth_token']);
		console.log(request.cookies['auth_token']);
		console.log("decrypted " + decrypted);
		client.get(decrypted, function (err, userInfo) {
			//params쓰면 address에 inform
			console.log(userInfo);
			var params = request.query;
			var cal_lower = params.cal_lower;
			var cal_upper = params.cal_upper;
			var count = params.count;
			// TODO: change q=chicken to something else l8er
			var url = "https://api.edamam.com/search?q=chicken&app_id=" + APP_ID + "&app_key=" + APP_KEY + "&from=0&to=" + count + "&calories=gte%20" + cal_lower + "%2C%20lte%20" + cal_upper + "&health=alcohol-free";
			req(url, function (err, resp, body) {
				console.log(resp);
				response.json(JSON.parse(body));
			});
		});
	}
};
