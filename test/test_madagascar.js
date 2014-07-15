var chai = require('chai'),
    should = chai.should(), nock = require('nock'),
    madagascar = require('../lib/madagascar');

chai.use(require('chai-fuzzy'));

describe('#madagascar', function() {

  it('handle a basic payload', function(done) {
    var payload,
        expectedResponses,
        entrance;

    entrance = madagascar();

    payload = {
      base_url: 'http://api.olapic.com',
      authentication:
      {
        'access_token': 'abcdef'
      },
      batch: [
        {
          url: 'http://api.olapic.com/media',
          method: 'POST',
          body: 'caption=%23madagascar&link=http%3A%2F%2Finstagram.com%2Fp%2FqMN-RWKc9U',
        },
        {
          relative_url: '/',
          method: 'GET',
        }
      ]
    };

    expectedResponses = [
      {
        status: 200,
        headers:
        {
          'content-type': 'text/javascript; charset=UTF-8'
        },
        body: '{\"id\":\"…\"}'
      },
      {
        status: 200,
        headers:
        {
          'content-type': 'text/javascript; charset=UTF-8'
        },
        body:'{\"data\":\"…\"}'
      },
    ];

    api = nock('http://api.olapic.com')
      .post('/media?access_token=abcdef', {
        caption: '#madagascar',
        link: 'http://instagram.com/p/qMN-RWKc9U'
      })
      .delay(20) // provoques the responses came inversed
      .reply(200, {
        id: '…'
      },{
        'content-type': 'text/javascript; charset=UTF-8'
      })
      .get('/?access_token=abcdef')
      .reply(200, {
        data: '…'
      }, {
        'content-type': 'text/javascript; charset=UTF-8'
      });

    entrance(payload, function(responses){
      responses.should.be.like(expectedResponses);
      done();
      api.isDone();
    });

  });


  it('google.com returns "Domain not allowed"', function(done){
    var payload,
        entrance;

    entrance = madagascar({
      domains: { restrictTo: [
        'api.olapic.com'
      ]}
    });

    payload = {
      batch: [{
          url: 'https://www.google.com/',
          method: 'GET',
      }]
    };

    entrance(payload, function(responses){
      responses.should.be.like({
        error: 'Domain not allowed'
      });
      done();
    });
  });


  it('a batch with size exceeded fails', function(done){
    var payload,
        entrance;

    entrance = madagascar({
      batchMaxSize: 2
    });

    payload = {
      batch: [{
          url: 'https://api.olapic.com/',
      },{
          url: 'https://api.olapic.com/',
      },{
          url: 'https://api.olapic.com/',
      }]
    };

    entrance(payload, function(responses){
      responses.should.be.like({
        error: 'Too many requests'
      });
      done();
    });
  });


  it('must fail when the batch is empty', function(done){
    var payload,
        entrance;

    entrance = madagascar();

    payload = {
      batch: []
    };

    entrance(payload, function(responses){
      responses.should.be.like({
        error: 'Empty batch'
      });
      done();
    });
  });

});
