var URI = require('URIjs'),
    _ = require('underscore-node'),
    request = require('./request'),
    config = require('./config');

module.exports = function(conf) {

  this.conf = config(conf || {});

  return function(payload, done) {
    var responses = {},
        callback,
        args,
        url;

    payload = _.defaults(payload, {
      base_url: this.conf.domains.baseUrl,
      authentication: {},
      batch: []
    });

    if (payload.batch.length > this.conf.batchMaxSize) {
        done({error: 'Too many requests'});
        return;
    }

    if (payload.batch.length === 0) {
        done({error: 'Empty batch'});
        return;
    }

    for (var i in payload.batch) {
      args = payload.batch[i];
      url = URI(args.url || payload.base_url + args.relative_url);
      url.addSearch(payload.authentication);
      args.url = url.toString();
      args.headers = _.defaults(args.headers || {}, this.conf.defaultHeaders);

      if (this.conf.domains.restrictTo.length > 0 &&
          this.conf.domains.restrictTo.indexOf(url.host()) < 0) {
        done({
          error: 'Domain not allowed'
        });
        return;
      }
    }

    callback = function(index, response){
      responses[index] = response;
      if (Object.keys(responses).length == payload.batch.length) {
        var a = [];
        for (var k in responses) {
          a.push(responses[k]);
        }
        done(a);
      }
    };

    for (var j in payload.batch) {
      args = payload.batch[j];
      args.index = j;
      args.finish = callback;
      request.send(args);
    }
  };

};
