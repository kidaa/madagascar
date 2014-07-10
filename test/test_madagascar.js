var chai = require('chai'),
    should = chai.should(), nock = require('nock'),
    http = require('http'),
    madagascar = require('../lib/madagascar');

chai.use(require('chai-fuzzy'));

describe('#madagascar', function() {
  it('handle a basic payload', function(done) {
    var payload,
        expectedResponses;

    payload = {
      base_url: 'http://local.olapic.com',
      authentication:
      {
        'access_token': 'abcdef'
      },
      batch: [
        {
          url: 'http://local.olapic.com/media',
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

    api = nock('http://local.olapic.com')
      .post('/media?access_token=abcdef', {
        caption: '#madagascar',
        link: 'http://instagram.com/p/qMN-RWKc9U'
      })
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

    madagascar(payload, function(responses){
        responses.should.be.like(expectedResponses);
        done();
        api.isDone();
    });

  });
});
