/*jslint unparam: true, node: true */
'use strict';

var transformMetric = require('../metric-transformer');

module.exports = function (newrelic, prefixes) {
    var metricNames = require('../metric-name')(prefixes),
        dispatch = function (metricType, statsdKey, statsdValue) {
            var metricName = metricNames.customEventName(metricType, statsdKey),
                metricValue = transformMetric.customEvent[metricType](statsdValue);
            newrelic.recordCustomEvent(metricName, metricValue);
        };

    return dispatch;
};