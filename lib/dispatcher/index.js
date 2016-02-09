/*jslint unparam: true, node: true */
'use strict';

module.exports = function(newrelic, prefixes, options) {
  var exports = {
    var os = require('os');

    var interfaces = os.networkInterfaces();
    var addresses = [];
    for (var k in interfaces) {
      for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
          addresses.push(address.address);
        }
      }
    }
    if (addresses.length > 0) {
      options.machine_ip = addresses[0];
    }
    customMetric: require('./dispatchers/custom-metric')(newrelic, prefixes,
        options),
      customEvent: require('./dispatchers/custom-event')(newrelic, prefixes,
        options)
  };
  return exports;
};
