var prefixes = {
    counters: 'Counters'
};

var metricNames = require('../lib/dispatcher/metric-name')(prefixes),
    assert = require('chai').assert;

describe('test for metric names generation', function() {

    describe('when asked for a custom metric name', function() {

        it('should return a name compliant with new relic standards', function(done) {
            var name = metricNames.customMetricName('counters', 'some.counter.key');
            assert.equal(name, 'Custom/Counters/some.counter.key', 'custom metric name must follow new relic standard');

            done();
        });

    });

    describe('when asked for a custom event name', function() {

        it('should return a name compliant with new relic standards', function(done) {
            var name = metricNames.customEventName('counters', 'some.counter.key');
            assert.equal(name, 'Counters_some_counter_key', 'custom event name must follow new relic standard');

            name = metricNames.customEventName('counters', 'some:counter.key');
            assert.equal(name, 'Counters_some:counter_key', 'custom event name must replace dots but not colons');

            name = metricNames.customEventName('counters', 'some#*counter+=key');
            assert.equal(name, 'Counters_some__counter__key', 'custom event name must replace all non alphanumeric, colon or dot characters');

            done();
        });

    });

});