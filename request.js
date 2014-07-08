var validateArguments = require('validate-arguments'),
    http = require('http'),
    querystring = require('querystring'),
    URI = require('URIjs'),
    _ = require('underscore-node');

module.exports = {
  request: function(args) {
    var options,
      req,
      uri;

    args = _.defaults(args, {
      url: '',
      method: 'GET',
      headers: {},
      data: null,
      finish: function(){}
    });

    args.headers = _.defaults(args.headers, {
      'Accept': '*/*',
    });

    if (args.data) {
      args.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      args.headers['Content-Length'] = args.data.length;
    }

    uri = URI(args.url);

    options = {
      host: uri.host(),
      path: uri.path() + uri.search(),
      port: uri.port() || 80,
      method: args.method,
      headers: args.headers,
    };

    req = http.request(options, function(res) {
      var str = '';

      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        str += chunk;
      });
      res.on('end', function () {
        args.finish(str);
      });
    });

    req.on('error', function(err) {
      args.finish(err);
    });

    if (args.data) {
      req.write(args.data);
    }
    req.end();
  }
};
