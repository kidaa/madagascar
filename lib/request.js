var http = require('http'),
    URI = require('URIjs'),
    _ = require('underscore-node');

module.exports = {
  send: function(args) {
    var options,
      req,
      uri;

    args = _.defaults(args, {
      url: '',
      method: 'GET',
      headers: {},
      body: null,
      finish: function(){}
    });

    args.headers = _.defaults(args.headers, {
      'Accept': '*/*',
    });

    if (args.body) {
      args.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      args.headers['Content-Length'] = args.body.length;
    }

    uri = URI(args.url);

    options = {
      host: uri.host(),
      path: uri.path() + uri.search(),
      // FIXME: it should leave to http mamage the default port
      port: uri.port() || 80,
      method: args.method,
      headers: args.headers,
    };

    req = http.request(options, function(res) {
      var str = '';

      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        str += chunk;
      });
      res.on('end', function() {
        args.finish({
          status: this.statusCode,
          headers: this.headers,
          body: str
        });
      });
      req.on('error', function(err) {
        throw err;
      });
    });

    if (args.body) {
      req.write(args.body);
    }
    req.end();
  }
};
