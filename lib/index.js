/**
 * This is a backend implementation for StatsD which will flush all
 * the metrics data directly to New Relic using the agent API
 */

'use strict';

var newrelic = require('newrelic');

var customMetricNames = {
        gauges:     'Custom/Gauges',
        counters:   'Custom/Counters',
        timer_data: 'Custom/TimerData',
        timers:     'Custom/Timers',
        sets:       'Custom/Sets'
    },
    options = {
        // Metrics to be sent to New Relic
        flushMetrics: ['gauges', 'counters'],

        // Custom metrics names to be used
        customMetricNames: {
            gauges:     'Custom/Gauges',
            counters:   'Custom/Counters',
            timer_data: 'Custom/TimerData',
            timers:     'Custom/Timers',
            sets:       'Custom/Sets'
        }
    };


/**
 *	Handle the flush event triggered by StatsD.
 *  This handler will read the gauges and counters data
 *  and send them to New Relic as Custom Metrics
 *  through the agent API recordMetric.
 *
 *  Unless other names are provided as part of the configuration, the Custom Metrics naming
 *  follows the New Relic suggested convention:
 *      - Custom/Gauges/[gauge.key.metric]
 *      - Custom/Counters/[counter.key.metric]
 *      ...
 *
 */
var onFlush = function(time, metrics) {
    console.log('flush event fired');

    options.flushMetrics.forEach(function(metricType){
        var metricKeysForType = metrics[metricType];

        for (var metricKey in metricKeysForType) {
            var customMetricName = options.customMetricNames[metricType] + '/' + metricKey;
            var customMetricValue = metrics[metricType][metricKey];
            console.log('sending metric to new relic: ' + customMetricName + ':' + customMetricValue);
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

    console.log(config);

    options.flushMetrics = config.flushMetrics || options.flushMetrics;
    options.customMetricNames.gauges = config.customMetricNames.gauges || options.customMetricNames.gauges;
    options.customMetricNames.counters = config.customMetricNames.counters || options.customMetricNames.counters;
    options.customMetricNames.timers = config.customMetricNames.timers || options.customMetricNames.timers;
    options.customMetricNames.timer_data = config.customMetricNames.timer_data || options.customMetricNames.timer_data;
    options.customMetricNames.sets = config.customMetricNames.sets || options.customMetricNames.sets;

    console.log(options);

    events.on('flush', onFlush);

    return true;
};