/*jslint unparam: true, node: true */
'use strict';

var transformMetric = require('../metric-transformer');

module.exports = function (newrelic, prefixes) {

    var metricNames = require('../metric-name')(prefixes),
        dispatch = function (metricType, statsdKey, statsdValue) {
            var metricName = metricNames.customMetricName(metricType, statsdKey),
                metricValue = transformMetric.customMetric[metricType](statsdValue);
            newrelic.recordMetric(metricName, metricValue);
        };

    return dispatch;
};