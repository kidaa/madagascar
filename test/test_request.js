var chai = require('chai'),
    should = chai.should(),
    nock = require("nock"),
    http = require("http"),
    request = require('../lib/request');

describe('#request', function() {
  it('responses with "Hello world" to a GET /hello', function(done) {

    api = nock("http://local.olapic.com")
          .get("/hello?q=world")
          .reply(200, "Hello World");

    request.send({
      url: 'http://local.olapic.com/hello?q=world',
      method: 'GET',
      finish: function(index, response){
        response.should.to.like({
          status: 200,
          headers: {},
          body: 'Hello World'
        });
        done();
        api.isDone();
      }
    });
  });

  it('returns "{id: /media/123abc}" to a POST /media', function(done) {

    api = nock('https://local.olapic.com')
      .post('/media', {
        caption: '#madagascar',
        link: 'http://instagram.com/p/qMN-RWKc9U'
      })
      .reply(200, {
        id: '/media/123abc'
      });

    request.send({
      url: 'https://local.olapic.com/media',
      method: 'POST',
      body: 'caption=%23madagascar&link=http%3A%2F%2Finstagram.com%2Fp%2FqMN-RWKc9U',
      finish: function(index, response){
        response.should.to.like({
          status: 200,
          headers: {'content-type': 'application/json'},
          body: '{\"id\":\"/media/123abc\"}'
        });
        done();
        api.isDone();
      }
    });
  });


  it('responses with {status: 0} to a network issues', function(done) {
    request.send({
      url: 'http://localhost:1',
      finish: function(index, response){
        response.should.to.like({
          status: 0,
          err: "connect ECONNREFUSED"
        });
        done();
        api.isDone();
      }
    });
  });

});
