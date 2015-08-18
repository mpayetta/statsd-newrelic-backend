var _ = require('lodash');

var transformTimerToObject = function(timerValue) {
    var max = _.max(timerValue);
    var min = _.min(timerValue);
    var count = timerValue.length;
    var total = _.sum(timerValue);
    var squareSum = _.sum(timerValue, function (val) {
        return Math.pow(val, 2);
    });

    return {
        min: min,
        max: max,
        count: count,
        total: total,
        sumOfSquares: squareSum
    }
}

/**
 * Helpers to convert a StatsD metric value into a New Relic compliant
 * custom metric or event value. For more information see:
 * https://docs.newrelic.com/docs/agents/nodejs-agent/supported-features/nodejs-agent-api#custom-metric-api
 * https://docs.newrelic.com/docs/insights/new-relic-insights/adding-querying-data/inserting-custom-events-new-relic-apm-agents
 *
 */
module.exports = {
    customMetric: {
        gauges: function (metricValue) {
            return metricValue;
        },

        counters: function (metricValue) {
            return metricValue;
        },

        sets: function (metricValue) {
            return metricValue;
        },

        /**
         * New relic does not support storing arrays, so we need to process timers data into
         * a compliant object with min, max, total, count and sumOfSquares values.
         */
        timers: function (metricValue) {
            if (metricValue.length == 0) return 0;
            else {
                return transformTimerToObject(metricValue);
            }
        }
    },

    customEvent: {
        gauges: function (metricValue) {
            return { 'eventValue': metricValue };
        },

        counters: function (metricValue) {
            return { 'eventValue': metricValue };
        },

        sets: function (metricValue) {
            return { 'eventValue': metricValue };
        },

        timers: function(metricValue) {
            if (metricValue.length == 0) return { eventValue: 0 };
            else {
                return transformTimerToObject(metricValue);
            }
        }
    }
};