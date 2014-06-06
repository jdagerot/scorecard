ObjectID = null;


function parseFormData(prefix, fix, formDataObject, createIdIfMissing) {
	console.log(formDataObject);

	var idx = 0;
	returnObject = {};

	for (var f in fix) {
		f = fix[f];
		var idx = 0;
		var object = {};
		fieldValue = formDataObject[prefix + idx+++f];

		while (fieldValue && fieldValue.length > 0) {
			object = returnObject[object._id] || {};
			object[f] = fieldValue;
			object._id = object._id || new ObjectID();
			returnObject[object._id] = (object);
			fieldValue = formDataObject[prefix + idx+++f];
		}
	}



	return returnObject;
	console.dir(returnObject);
}

/*
 * GET home page.
 */
var database, collCompetitions;
module.exports = function(app, database) {
	var app = app;
	ObjectID = require('mongodb').ObjectID;
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
				team: 'Team_1',
				sex: 'M'
			};
			id = new ObjectID();
			base.branches[id] = {
				name: 'Gren nummer 1',
				comment: 'Kommentar om grenen #1',
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

		if (typeof scorecardID != "undefined") {
			console.log("Loading from server");

			collCompetitions.findOne({
				_id: scorecardID
			}, function(err, docs) {
				if (err) {
					console.dir(err)
				} else {

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
		var object = {
			_id: req.body.scorecardID,
			competition: {
				name: req.body.competionName
			},
			users: parseFormData("user", ["name", "team", "sex", "_id"], req.body, true),
			branches: parseFormData("branch", ["name", "comment", "unit", "_id"], req.body),
		};

		for (b in object.branches) {
			object.branches[b]._id = object.branches[b]._id || new ObjectID();
		}

		for (user in object.users) {
			console.log("User: " + user);
			user = object.users[user];
			console.log("User object:");
			console.dir(user);
			user._id = user._id || new ObjectID();
			user.branches = object.branches;
			for (i in user.branches) {
				user.branches[i].score = 0;
			}
			collUsers.update({
				_id: user._id
			}, user, {
				upsert: true
			}, function(err, docs)  {
				if (err) console.dir(err);
				console.log("Saved/updated" + docs);
			});
		}

		object._id = object._id || new ObjectID();
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



		collCompetitions.aggregate([

			{
				$match: {
					_id: scorecardID
				}
			}, {
				$unwind: "$users"
			}, {
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

		// Loop thrrough all fields in the req.body object
		for (idx in req.body) {
			value = req.body[idx];
			console.log(idx + "=" + value);
			parts = idx.split["_"]; // Now idx 1 should be member._id and idx 2 should be branch._id


			//			collCompetitions.update({},)
		}

		res.redirect("/scores/" + scorecardID);
	}
}