var guid = (function() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}
	return function() {
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
	};
})();

/*
 * GET home page.
 */
var database, collCompetitions;
module.exports = function(app, database) {
	var app = app;
	var database = database;
	console.log(database.name);
	var collCompetitions = database.collection("Competitions");

	console.log(database.collection("TEST").findOne({}, function(err, docs) {
		console.log(docs)
	}));

	this.index = function(req, res) {
		res.render('index', {
			title: 'Scorekeeper'
		});
		console.log("In function index!");

	};

	this.setup = function(req, res) {
		var scorecardID = req.params.scorecardID || guid();
		res.render('setup', {
			title: 'Scorekeeper Configuration',
			scorecardID: scorecardID
		});
	};


	this.saveSetup = function(req, res) {
		if (req.body.scorecardID != "undefined") {
			req.body._id = req.body.scorecardID;
		}
		console.log(req.body);

		// Build up a json object of the form data
		var object = {
			competition: {},
			users: []
		};
		var userIdx = 1;
		var name = "username_User" + userIdx++;
		userField = req.body[name];
		while (userField && userField.length>0) {
			object.users.push({"name" : userField});
			name = "username_User" + userIdx++;
			userField = req.body[name];
		}

		console.log(object);


		collCompetitions.insert(object, function(err, docs)  {
			res.send("Saved" + docs);
		});

	}

};