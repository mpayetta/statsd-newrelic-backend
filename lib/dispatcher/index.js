/*jslint unparam: true, node: true */
'use strict';

module.exports = function (newrelic, prefixes,options) {
    var exports = {
        customMetric: require('./dispatchers/custom-metric')(newrelic, prefixes,options),
        customEvent: require('./dispatchers/custom-event')(newrelic, prefixes,options)
    };
    return exports;
};
