ObjectID = null;


function parseFormData(formDataObject) {
	var returnObject = {};

	for (idx in formDataObject) {
		var parts = idx.split("_");

		if (parts.length === 3) {

			var arrayName = parts[0];
			var key = parts[1];
			var field = parts[2];
			var currentArr = returnObject[arrayName] || {};
			var currentArrKey = currentArr[key] || {};
			currentArrKey[field] = formDataObject[idx];
			currentArr[key] = currentArrKey;
			returnObject[arrayName] = currentArr;
		}
	}

	return returnObject;

}

/*
 * GET home page.
 */
var database, collCompetitions;
module.exports = function(app, database) {
	var app = app;
	ObjectID = require('mongodb').ObjectID;
	var extend = require('node.extend');
	var database = database;
	console.log(database.name);
	var collCompetitions = database.collection("Competitions");
	var collUsers = database.collection("users");

	console.log(database.collection("TEST").findOne({}, function(err, docs) {
		console.log(docs)
	}));


	function getBaseCompetition() {

		var base = {
			scorecardID: new ObjectID(),
			competition: {
				name: 'Min tävling'
			},
			users: {},
			branches: {}

		}

		// add some sample data

		for (var i = 0; i < 5; i++) {
			var id = new ObjectID();
			base.users[id] = {
				name: 'Användare_' + i,
				team: 'Team_' + i,
				sex: 'M'
			};
			id = new ObjectID();
			base.branches[id] = {
				name: 'Gren nummer ' + i,
				comment: 'Kommentar om grenen #' + i,
				unit: 'Kilogram'
			};
		}
		return base;
	}



	this.index = function(req, res) {

		collCompetitions.find({}).toArray(function(err, docs) {
			if (err) {
				console.dir(err)
			} else {
				console.dir(docs);
				res.render('index', {
					title: 'Scorekeeper',
					competitions: docs
				});
			}


		})
	};

	this.setup = function(req, res) {
		var scorecardID = req.params.scorecardID;
		console.log("scorecardID: " + scorecardID);
		if (typeof scorecardID != "undefined") {
			console.log("Loading from server");

			collCompetitions.findOne({
				_id: scorecardID
			}, function(err, docs) {
				if (err) {
					console.dir(err)
				} else {
					console.info("this.setup");
					console.dir(docs);
					docs.scorecardID = docs._id;
					res.render('setup', {
						title: 'Scorekeeper Configuration test',
						comp: docs
					});

				}
			})

		} else {

			var comp = getBaseCompetition();
			comp.scorecardID = new ObjectID()

			res.render('setup', {
				title: 'Scorekeeper Configuration',
				comp: comp
			});
		}
	};


	this.saveSetup = function(req, res) {

		console.dir(req.body.scorecardID);

		// Build up a json object of the form data
		var object = parseFormData(req.body);

		object._id = req.body.scorecardID;
		object.competitionName = req.body.competitionName

		// collUsers.update({
		// 	_id: user._id
		// }, user, {
		// 	upsert: true
		// }, function(err, docs)  {
		// 	if (err) console.dir(err);
		// 	console.log("Saved/updated" + docs);
		// });

		object._id = object._id || new ObjectID();

		// Wrap out the users
		userArray = [];
		for(var idx in object.users) {
			userObj = object.users[idx];
			userObj.id = idx;
			userArray.push(userObj);
		}

		// Wrap out the branches
		branchArray = [];
		for(var idx in object.branches) {
			branchObj = object.branches[idx];
			branchObj.id = idx;
			branchArray.push(branchObj);
		}

		object.users =userArray;
		object.branches = branchArray;


		console.info("This object will be saved to db:");
		console.dir(object);
				collCompetitions.update({
			_id: object._id
		}, object, {
			upsert: true
		}, function(err, docs)  {
			console.dir(err);
			res.redirect("/setup/" + object._id);
		});

	}

	this.showScorecard = function(req, res)  {
		var scorecardID = req.params.scorecardID;


		console.log("Finding id:" + scorecardID);
		collCompetitions.aggregate([

			{
				$match: {
					_id: scorecardID
				}
			}, {$unwind : "$users"},
			{
				$group: {
					_id: "$users.team",
					members: {
						$push: "$users"
					},
					competitionName: {
						$first: "$competition.name"
					},
					scorecardID: {
						$first: "$_id"
					}

				}
			}, {
				$sort: {
					_id: 1,
					members: 1
				}
			}
		], function(err, docs) {
			console.dir("scorecardID: " + scorecardID);
			console.dir(docs);
			if (err) {
				console.log(err)
			} else {
				docs.scorecardID = docs._id;

				res.render("scores", {
					comp: docs
				});
			}
		});


	}

	this.addScorecard = function(req, res)  {
		var scorecardID = req.params.scorecardID;
		console.log("Adding scorecards");
		// Loop thrrough all fields in the req.body object
		console.dir(req.body);
		for (idx in req.body) {
			value = req.body[idx];
			console.log(idx + "=" + value);
			parts = idx.split["_"]; // Now idx 1 should be member._id and idx 2 should be branch._id


			//			collCompetitions.update({},)
		}

		res.redirect("/scores/" + scorecardID);
	}
}