var URI = require('URIjs'),
    _ = require('underscore-node'),
    request = require('./request');

module.exports = function(payload, done) {
  var responses = [],
      callback;

  payload = _.defaults(payload, {
    base_url: null,
    authentication: {},
    batch: []
  });

  callback = function(response){
    responses.splice(i, 0, response);
    if (responses.length == payload.batch.length) {
      done(responses);
    }
  };

  for (var i in payload.batch) {
    var args,
        url;

    args = payload.batch[i];
    url = URI(args.url || payload.base_url + args.relative_url);
    url.addSearch(payload.authentication);

    request.send({
      url: url.toString(),
      method: args.method,
      body: args.body,
      finish: callback
    });
  }
  return;
};
