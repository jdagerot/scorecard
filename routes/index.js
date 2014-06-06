ObjectID = null;


function parseFormData(prefix, fix, formDataObject, createIdIfMissing) {
	console.log(formDataObject);

	var idx = 0;
	returnObject = [];

	for (var f in fix) {
		f = fix[f];
		var idx = 0;
		var object = {};
		fieldValue = formDataObject[prefix + idx+++f];

		while (fieldValue && fieldValue.length > 0) {
			object = returnObject[idx - 1] || {};
			object[f] = fieldValue;
			returnObject[idx - 1] = (object);
			fieldValue = formDataObject[prefix + idx+++f];
		}
	}

	if(createIdIfMissing) {
		for(i in returnObject) {
			returnObject[i]._id = returnObject[i]._id || new ObjectID()

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
	var database = database;
	console.log(database.name);
	var collCompetitions = database.collection("Competitions");
	var collUsers = database.collection("users");

	console.log(database.collection("TEST").findOne({}, function(err, docs) {
		console.log(docs)
	}));


				var baseCompetion = {
				scorecardID: new ObjectID(),
				competition: {
					name: 'Min tävling'
				},
				users: [{
					name: 'Användare_1',
					team: 'Team_1',
					sex: 'M'
				}, {
					name: 'Användare_2',
					team: 'Team_2',
					sex: 'M'
				}, {
					name: 'Användare_3',
					team: 'Team_3',
					sex: 'M'
				}, {
					name: 'Användare_4',
					team: 'Team_4',
					sex: 'M'
				}, {
					name: 'Användare_5',
					team: 'Team_5',
					sex: 'M'
				}],
				branches: [{
					name: 'Gren nummer 1',
					comment: 'Kommentar om grenen #1',
					unit: 'Kilogram'
				}, {
					name: 'Gren nummer 2',
					comment: 'Kommentar om grenen #2',
					unit: 'Kilogram'
				}, {
					name: 'Gren nummer 3',
					comment: 'Kommentar om grenen #3',
					unit: 'Kilogram'
				}, {
					name: 'Gren nummer 4',
					comment: 'Kommentar om grenen #4',
					unit: 'Kilogram'
				}, {
					name: 'Gren nummer 5',
					comment: 'Kommentar om grenen #5',
					unit: 'Kilogram'
				}]
			}



	this.index = function(req, res) {
		res.render('index', {
			title: 'Scorekeeper'
		});
		console.log("In function index!");

	};

	this.setup = function(req, res) {
		var scorecardID = req.params.scorecardID;

		if (typeof scorecardID != "undefined") {
			console.log("Loading from server");

			collCompetitions.findOne({_id : scorecardID}, function(err,docs) {
				if(err) {console.dir(err)} else {
				
					console.dir(docs);
					docs.scorecardID = docs._id;
				res.render('setup', {
					title: 'Scorekeeper Configuration test',
					comp: docs
				});

				}
			})

		} else {

			var comp = baseCompetion;
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
			branches: parseFormData("branch", ["name", "comment", "unit"], req.body),
		};

		for (user in object.users) {
			console.log("User: " + user);
			user = object.users[user];
			console.log("User object:");
			console.dir(user);
			collUsers.update({
				_id: user.id || new ObjectID()
			}, user, {
				upsert: true
			}, function(err, docs)  {
				if (err) console.dir(err);
				console.log("Saved/updated" + docs);
			});
		}

		object._id = object._id  || new ObjectID();
		collCompetitions.update({
			_id: object._id
		}, object, {
			upsert: true
		}, function(err, docs)  {
			console.dir(err);
			res.redirect("/setup/" + object._id);
		});

	}
}