/**
 * Module dependencies.
 */

var express = require('express');

var http = require('http');
var path = require('path');

var app = express();
var Db = require('mongodb').Db;
var ObjectID = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;


// default to a 'localhost' configuration:
var connection_string = '127.0.0.1:27017/scorekeeper';
// if OPENSHIFT env variables are present, use the available connection info:
if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
	connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
		process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
		process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
		process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
		process.env.OPENSHIFT_APP_NAME;
}


// global.DBUtils.mongoose.connect('mongodb://localhost:27017/beertaste');
console.info("CONNECTION STRING:" + "mongodb://" + connection_string);
MongoClient.connect("mongodb://" + connection_string, function(err, db) {
	if (err) {
		console.info("HALT:" + err);
	} else {
		var routes = require('./routes');
		var routes = new routes(app, db);
		// all environments
		app.set('port', process.env.PORT || 3000);
		app.set('views', path.join(__dirname, 'views'));
		app.set('view engine', 'jade');
		app.use(express.favicon());
		app.use(express.logger('dev'));
		app.use(express.json());
		app.use(express.urlencoded());
		app.use(express.methodOverride());
		app.use(app.router);
		app.use(express.static(path.join(__dirname, 'public')));

		// development only
		if ('development' == app.get('env')) {
			app.use(express.errorHandler());
		}

		app.get('/', routes.index);
		app.post('/setup/:scorecardID', routes.saveSetup)
		app.get('/setup/:scorecardID', routes.setup)
		app.get('/setup', routes.setup)

		http.createServer(app).listen(app.get('port'), function() {
			console.log('Express server listening on port ' + app.get('port'));
		});
	}
});