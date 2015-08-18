/*jslint unparam: true, node: true */
'use strict';

/**
 * This is a backend implementation for StatsD which will flush all
 * the metrics data directly to New Relic using the agent API
 */


/**
 *  Instantiation of dispatcher and newrelic are delayed up to the init function
 *  to use the newrelic app name and license key configured through statsD
 */
var dispatcher,
    newrelic;

var options = {
    // Metrics to be sent to New Relic
    dispatchMetrics: ['gauges', 'counters', 'timers', 'sets'],

    // Dispatchers to be used
    dispatchers: ['customEvent'],

    // Custom metrics names to be used
    metricPrefix: {
        gauges: 'Gauges',
        timers: 'Timers',
        counters: 'Counters',
        sets: 'Sets'
    }
};

/**
 *  Handle the flush event triggered by StatsD.
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
var onFlush = function (time, metrics) {
    /**
     * Iterate over every kind of metric we want to send to new relic
     */
    options.dispatchMetrics.forEach(function (metricType) {
        var statsdKeysForType = metrics[metricType],
            statsdKey,
            statsdValue,
            dispatchMetric = function (dispatcherType) {
                dispatcher[dispatcherType](metricType, statsdKey, statsdValue);
            };

        for (statsdKey in statsdKeysForType) {
            if (statsdKeysForType.hasOwnProperty(statsdKey)) {
                statsdValue = metrics[metricType][statsdKey];
                options.dispatchers.forEach(dispatchMetric);
            }
        }

    });
};

/**
 *  Expose the init function to StatsD.
 *  The init function simply waits for the event flush to be fired
 *  by StatsD and then process the metrics and sends them to New Relic
 */
exports.init = function (startup_time, config, events) {
    if (!startup_time || !config || !events) {
        return false;
    }

    options.dispatchMetrics = config.dispatchMetrics || options.dispatchMetrics;
    options.dispatchers = config.dispatchers || options.dispatchers;

    /**
     * Global metric prefix option will override any other configured metric prefixes
     */
    if (config.globalMetricPrefix) {
        options.metricPrefix.gauges
            = options.metricPrefix.counters
            = options.metricPrefix.timers
            = options.metricPrefix.sets
            = config.globalMetricPrefix;
    } else if (config.metricPrefix) {
        options.metricPrefix.gauges = config.metricPrefix.gauges || options.metricPrefix.gauges;
        options.metricPrefix.counters = config.metricPrefix.counters || options.metricPrefix.counters;
        options.metricPrefix.timers = config.metricPrefix.timers || options.metricPrefix.timers;
        options.metricPrefix.sets = config.metricPrefix.sets || options.metricPrefix.sets;
    }

    if (config.newRelicApp) {
        process.env.NEW_RELIC_APP_NAME = config.newRelicApp;
    }
    if (config.newRelicLicense) {
        process.env.NEW_RELIC_LICENSE_KEY = config.newRelicLicense;
    }

    newrelic = require('newrelic');
    dispatcher = require('./dispatcher')(newrelic, options.metricPrefix);

    events.on('flush', onFlush);

    return true;
};