/*jslint unparam: true, node: true */
'use strict';

var transformMetric = require('../metric-transformer');

module.exports = function (newrelic, prefixes,options) {
    var metricNames = require('../metric-name')(prefixes),
        dispatch = function (metricType, statsdKey, statsdValue) {
            var metricName = metricNames.customEventName(metricType, statsdKey),
                metricValue = transformMetric.customEvent[metricType](statsdValue);
            if (!options.customEvent.singleTable)
                {
                    newrelic.recordCustomEvent(metricName, metricValue);
                }
            else {
                  metricValue['metricName'] = metricName
                  var tableName = options.customEvent.tableName;
                  newrelic.recordCustomEvent(tableName, metricValue);
            }
        };

    return dispatch;
};
