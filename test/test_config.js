var chai = require('chai'),
    should = chai.should(),
    expect = chai.expect,
    config = require('../lib/config'),
    conf;

chai.use(require('chai-fuzzy'));

describe('#config', function() {
  it('default values', function(done) {
    conf = config({});
    expect(conf.domains.baseUrl).to.be.a('null');
    conf.domains.restrictTo.should.be.like([]);
    conf.defaultHeaders.should.be.like({});
    conf.batchMaxSize.should.be.equal(10);
    done();
  });

  it('domains constraints', function(done) {
    conf = config({
      domains: {
        restrictTo: [
          'api.photorank.me'
        ]
      }
    });
    expect(conf.domains.baseUrl).to.be.a('null');
    conf.domains.restrictTo.should.be.like([
      'api.photorank.me'
    ]);
    conf.batchMaxSize.should.be.equal(10);
    done();
  });

  if('baseUrl and bachMaxSize', function(done){
    conf = config({
      defaultHeaders: {
          'Accept': '*/*; q=0.2'
      },
      domains: {
        baseUrl: 'https://api.olapic.com'
      },
      batch: {
        maxSize: 14,
      }
    });
    conf.domains.baseUrl.should.be.equal('https://api.olapic.com');
    conf.defaultHeaders.Accept.should.be.equal('*/*; q=0.2');
    conf.batch.maxSize.should.be.equal(14);
    done();
  });
});
