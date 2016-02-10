/*jslint unparam: true, node: true */
'use strict';
var os = require('os');

module.exports = function (newrelic, prefixes, options) {
    options.machine_ip  = (function () {
        var interfaces = os.networkInterfaces(), addresses = [], k, k2, address;
        for (k in interfaces) {
            if (interfaces.hasOwnProperty(k)) {
                for (k2 in interfaces[k]) {
                    if (interfaces[k].hasOwnProperty(k2)) {
                        address = interfaces[k][k2];
                        if (address.family === 'IPv4' && !address.internal) {
                            addresses.push(address.address);
                        }
                    }
                }
            }
        }
        if (addresses.length > 0) {
            address = addresses[0];
        } else {
            address = "null";
        }
        return address;
    }());


    var exports = {
        customMetric: require('./dispatchers/custom-metric')(newrelic, prefixes, options),
        customEvent: require('./dispatchers/custom-event')(newrelic, prefixes, options)
    };
    return exports;
};
