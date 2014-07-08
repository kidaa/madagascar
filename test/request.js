var should = require('chai').should(),
    nock = require("nock"),
    http = require("http"),
    request = require('../request').request;

describe('#request', function() {
  it('GET /hello responses "Hello World"', function(done) {

    api = nock("http://local.olapic.com")
          .get("/hello")
          .reply(200, "Hello World");

    request({
      url: 'http://local.olapic.com/hello',
      method: 'GET',
      finish: function(response){
        response.should.to.equal('Hello World');
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

    request({
      url: 'http://local.olapic.com/media',
      method: 'POST',
      data: 'caption=%23madagascar&link=http%3A%2F%2Finstagram.com%2Fp%2FqMN-RWKc9U',
      finish: function(response){
        response.should.to.equal('{"id":"/media/123abc"}');
        done();
        api.isDone();
      }
    });
  });

});
