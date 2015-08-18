/*jslint unparam: true, node: true */
'use strict';

module.exports = function (newrelic, prefixes) {
    var exports = {
        customMetric: require('./dispatchers/custom-metric')(newrelic, prefixes),
        customEvent: require('./dispatchers/custom-event')(newrelic, prefixes)
    };
    return exports;
};