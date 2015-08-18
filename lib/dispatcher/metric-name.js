/**
 * Helper module to generate metric names to be sent to newrelic
 */
module.exports = function(prefixes) {

    var MANDATORY_CUSTOM_METRIC_PREFIX = 'Custom'

    var exports = {

        /**
         * New relic custom metrics must follow the naming convention "Custom/[category]/[label]"
         */
        customMetricName: function (metricType, statsdKey) {
            return [MANDATORY_CUSTOM_METRIC_PREFIX, '/', prefixes[metricType], '/', statsdKey].join('');
        },

        /**
         * Custom events don't allow to have dots in the name so we need to replace them with '_'
         */
        customEventName: function (metricType, statsdKey) {
            statsdKey = statsdKey.replace(/([^a-zA-Z0-9:_])/g, '_');
            return [prefixes[metricType], '_', statsdKey].join('');
        }
    }

    return exports;
}
