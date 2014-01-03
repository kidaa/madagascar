var should = require('chai').should(),
    nock = require("nock"),
    http = require("http"),
    request = require('../request').request;

describe('#request', function() {
  it('GET /hello responses "Hello World"', function(done) {

    api = nock("https://local.olapic.com")
          .get("/hello")
          .reply(200, "Hello World");

    request({
      url: 'https://local.olapic.com/hello',
      method: 'GET',
      finish: function(response){
        response.should.to.equal('Hello World');
        done();
        api.isDone()
      }
    });
  });


});
