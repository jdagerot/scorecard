
/*
 * GET home page.
 */
module.exports = function Routes(app, database) {
	this.app = app;
	this.database = database;

exports.index = function(req, res){
  res.render('index', { title: 'Scorekeeper' });
};

exports.setup = function(req, res){

  res.render('setup', { title: 'Scorekeeper Configuration', scorecardID : req.params.scorecardID });
};


};
