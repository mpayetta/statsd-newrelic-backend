var _ = require('lodash');

/**
 * Helpers to convert a StatsD metric value into a New Relic compliant
 * custom metric value. For more information see:
 * https://docs.newrelic.com/docs/agents/nodejs-agent/supported-features/nodejs-agent-api#custom-metric-api
 *
 */
module.exports = {
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
    timers: function(metricValue) {
        if (metricValue.length == 0) return 0;

        var max = _.max(metricValue);
        var min = _.min(metricValue);
        var count = metricValue.length;
        var total = _.sum(metricValue);
        var squareSum = _.sum(metricValue, function(val) {
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
};