var http = require('http'),
    https = require('https'),
    URI = require('URIjs'),
    _ = require('underscore-node');

module.exports = {
  send: function(args) {
    var options,
      req,
      uri,
      listener;

    args = _.defaults(args, {
      index: 0,
      url: '',
      method: 'GET',
      headers: {},
      body: null,
      finish: function(){}
    });

    if (args.body) {
      args.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      args.headers['Content-Length'] = args.body.length;
    }

    uri = URI(args.url);

    options = {
      host: uri.host(),
      path: uri.path() + uri.search(),
      port: uri.port() || undefined,
      method: args.method,
      headers: args.headers,
    };

    listener = function(res) {
      var str = '';
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        str += chunk;
      });
      res.on('end', function() {
        args.finish(args.index, {
          status: this.statusCode,
          headers: this.headers,
          body: str
        });
      });
    };

    if (uri.scheme() == 'http') {
      req = http.request(options, listener);
    } else {
      req = https.request(options, listener);
    }

    req.on('error', function(err) {
      args.finish(args.index, {
        status: 0,
        err: err.message
      });
    });

    if (args.body) {
      req.write(args.body);
    }
    req.end();
  }
};
