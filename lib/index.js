/**
 * This is a backend implementation for StatsD which will flush all
 * the metrics data directly to New Relic using the agent API
 */

'use strict';

var metricValue = require('./metricTransformer');
var newrelic;

var options = {
        // Metrics to be sent to New Relic
        flushMetrics: ['gauges', 'counters', 'timers', 'sets'],

        // Custom metrics names to be used
        customMetricPrefix: {
            gauges: 'Gauges',
            timers: 'Timers',
            counters: 'Counters',
            sets: 'Sets'
        }
    },
    MANDATORY_METRIC_PREFIX = 'Custom';


/**
 *	Handle the flush event triggered by StatsD.
 *  This handler will read the gauges and counters data and send them to New Relic as Custom Metrics
 *  through the agent API recordMetric.
 *
 *  Unless other names are provided as part of the configuration, the Custom Metrics naming
 *  follows the New Relic suggested convention:
 *      - Custom/[gauge.key.metric]
 *      - Custom/[counter.key.metric]
 *      ...
 *
 */
var onFlush = function(time, metrics) {
    /**
     * Iterate over every kind of metric we want to send to new relic
     */
    options.flushMetrics.forEach(function(metricType){
        var metricKeysForType = metrics[metricType];

        var customMetricPrefix = MANDATORY_METRIC_PREFIX + '/' + options.customMetricPrefix[metricType];

        /**
         * Iterate over all metric keys for the given metric type and record the metrics
         * in New Relic through the agent API "recordMetric"
         */
        for (var metricKey in metricKeysForType) {
            var customMetricName = customMetricPrefix + '/' + metricKey;

            // Get the metric value accordint to it's type
            var customMetricValue = metricValue[metricType](metrics[metricType][metricKey]);
            newrelic.recordMetric(customMetricName, customMetricValue);
        };
    });
};

/**
 *	Expose the init function to StatsD.
 *  The init function simply waits for the event flush to be fired
 *  by StatsD and then process the metrics and sends them to New Relic
 */
exports.init = function(startup_time, config, events) {
    if (!startup_time || !config || !events) return false;


    options.flushMetrics = config.flushMetrics || options.flushMetrics;

    /**
     * Global metric prefix option will override any other configured metric prefixes
     */
    if (config.globalMetricPrefix) {
        options.customMetricPrefix.gauges
            =  options.customMetricPrefix.counters
            = options.customMetricPrefix.timers
            = options.customMetricPrefix.sets
            = config.globalMetricPrefix;
    }
    else if (config.customMetricPrefix) {
        options.customMetricPrefix.gauges = config.customMetricPrefix.gauges || options.customMetricPrefix.gauges;
        options.customMetricPrefix.counters = config.customMetricPrefix.counters || options.customMetricPrefix.counters;
        options.customMetricPrefix.timers = config.customMetricPrefix.timers || options.customMetricPrefix.timers;
        options.customMetricPrefix.sets = config.customMetricPrefix.sets || options.customMetricPrefix.sets;
    }

    if (config.newRelicApp) {
        process.env.NEW_RELIC_APP_NAME = config.newRelicApp;
    }
    if (config.newRelicLicense) {
        process.env.NEW_RELIC_LICENSE_KEY = config.newRelicLicense;
    }

    newrelic = require('newrelic');

    events.on('flush', onFlush);

    return true;
};