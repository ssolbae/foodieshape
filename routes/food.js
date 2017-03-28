//controller for getting food APIs
var req = require('request');
var redis = require('redis');
tvar client = redis.createClient();
var async = require('async');
var APP_ID = "e70975c3";
var APP_KEY = "385b9c2b7534484726391d264e192213";

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
		var daily_cal = userInfo.daily_cal;
		var cal_each = [(daily_cal/3)-50, (daily_cal/3), (daily_cal/3)+50];

		var data_to_send = [];

		// populate data_to_send here
		var fxns = [];
		for (var i = 0; i < 3; i++) {
			var cal_lower  = Math.floor(cal_each[i]) - 50;
			var cal_upper = Math.floor(cal_each[i]) + 50;
			var search_key = ["breakfast", "lunch", "dinner"];
			(function () {
				//url is eg of closure
				var url = "https://api.edamam.com/search?q=" + search_key[i] + "&app_id=" + APP_ID + "&app_key=" + APP_KEY + "&from=0&to=" + 1 + "&calories=gte%20" + cal_lower + "%2C%20lte%20" + cal_upper + "&health=alcohol-free";
				console.log("url: " + url);
				var task = function (done) {
					req(url, function (err, resp, body) {
						if (err) {
							// response.json(err); --> can't be this bc response.json can happen 2x; pass err to done
							done(err);
							return;
						} else {
							var data = JSON.parse(body);
							var tmp = {};
							tmp.url = data.hits[0].recipe.url;
							tmp.image = data.hits[0].recipe.image;
							tmp.label = data.hits[0].recipe.label;
							console.log("FUCKING LABEL: " + tmp.label);
							tmp.calories = cal_lower + "-" + cal_upper;
							tmp.grams = Math.floor((cal_lower+cal_upper)/2 / Math.floor((data.hits[0].recipe.calories)/(data.hits[0].recipe.totalWeight)));
							data_to_send.push(tmp);
							done();
						}
					});
				};
				fxns.push(task);
			})();
		}
		async.series(fxns, function (err, data) {
			response.json(data_to_send);
		});
	});
	},


	getRecipes: function (request, response) {
		// TODO
		var decrypted = encrypt_util.decrypt(request.cookies['auth_token']);
		console.log(request.cookies['auth_token']);
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
				// console.log(resp);
				response.json(JSON.parse(body));
			});
		});
	}
};
