var chai = require('chai'),
    should = chai.should(),
    nock = require("nock"),
    http = require("http"),
    request = require('../lib/request');

describe('#request', function() {
  it('GET /hello responses "Hello World"', function(done) {

    api = nock("http://local.olapic.com")
          .get("/hello")
          .reply(200, "Hello World");

    request.send({
      url: 'http://local.olapic.com/hello',
      method: 'GET',
      finish: function(response){
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

  it('POST /media returns "{id: /media/123abc}"', function(done) {

    api = nock('http://local.olapic.com')
      .post('/media', {
        caption: '#madagascar',
        link: 'http://instagram.com/p/qMN-RWKc9U'
      })
      .reply(200, {
        id: '/media/123abc'
      });

    request.send({
      url: 'http://local.olapic.com/media',
      method: 'POST',
      body: 'caption=%23madagascar&link=http%3A%2F%2Finstagram.com%2Fp%2FqMN-RWKc9U',
      finish: function(response){
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

});
