var request = require('superagent');
var expect = require('expect.js');

var TEST_COMPETITION_NAME = "VerySpecificCompetitionUsedForTestsOnly"

describe('The API', function(){
 it ("Should connect to server", function(done){
   request.get('localhost:3000').end(function(res){

    expect(res).to.exist;
    expect(res.status).to.equal(200);
//    console.log(res);
    expect(res.text).to.contain('Scorekeeper');
    done();
   });
  });

  it ("Should load scorecard configuration form", function(done){
   request.get('localhost:3000/setup').end(function(res){

    expect(res).to.exist;
    expect(res.status).to.equal(200);
//    console.log(res);
    expect(res.text).to.contain('Scorekeeper Configuration');
    done();
   });
  });

  it ("Should load scorecard configuration form", function(done){
   request.get('localhost:3000/setup').end(function(res){

    expect(res).to.exist;
    expect(res.status).to.equal(200);
//    console.log(res);
    expect(res.text).to.contain('Scorekeeper Configuration');
    done();
   });
  });


  it ("Should load scorecard configuration form for a specific competition", function(done){
   request.get('localhost:3000/setup/' + TEST_COMPETITION_NAME).end(function(res){

    expect(res).to.exist;
    expect(res.status).to.equal(200);
//    console.log(res);
    expect(res.text).to.contain(TEST_COMPETITION_NAME);
    done();
   });
  });
describe('Updateing specific competition and save the result', function(done){
 it ("Should update a scorecard configuration for a specific competition", function(done){
   request.post('localhost:3000/setup/' + TEST_COMPETITION_NAME).end(function(res){

    expect(res).to.exist;
    expect(res.status).to.equal(200);
    expect(res.text).to.contain(TEST_COMPETITION_NAME);
   });
  });

 it ("The update scorecard should contain the new data", function(done){
   request.post('localhost:3000/setup/' + TEST_COMPETITION_NAME).end(function(res){

    expect(res).to.exist;
    expect(res.status).to.equal(200);
    expect(res.text).to.contain(TEST_COMPETITION_NAME);
   });
  });


});

});