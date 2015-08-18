/*jslint node: true */
'use strict';

module.exports = {
    counters: {
        'statsd.samplecounter1': 3,
        'statsd.samplecounter2': 6,
        'statsd.samplecounter3': 4
    },

    gauges: {'statsd.samplegauge1': 12},

    timers: {'statsd.emptytimer': [], 'statsd.sampletimer': [2, 6, 4, 3, 5, 1]},

    sets: {'statsd.sampleset1': 22, 'statsd.sampleset2': 2}
};