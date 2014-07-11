var _ = require('underscore-node');

module.exports = function(conf) {
  conf = _.defaults(conf, {
    domains: {},
    batchMaxSize: 10,
    defaultHeaders: {}
  });

  conf.domains = _.defaults(conf.domains, {
    baseUrl: null,
    restrictTo: []
  });

  return conf;
};
