var transformer = require('../lib/dispatcher/metric-transformer'),
    flush = require('./flush-sample.js'),
    assert = require('chai').assert;

describe('simple metric transformer test', function(){

    describe('when transforming counters', function(){
        it('should have the correct counter value transformed', function(done){
            var metricValue = flush.timers['statsd.samplecounter1'];
            assert.equal(transformer.customMetric.counters(metricValue), metricValue, 'transformed custom metric counter value must be the same as original value');
            assert.equal(transformer.customEvent.counters(metricValue).eventValue, metricValue, 'transformed custom event counter value must be the same as original value');
            done();
        });
    });

    describe('when transforming gauges', function(){
        it('should have the correct gauge value transformed', function(done){
            var metricValue = flush.timers['statsd.samplegauge1'];
            assert.equal(transformer.customMetric.gauges(metricValue), metricValue, 'transformed custom metric gauge value must be the same as original value');
            assert.equal(transformer.customEvent.gauges(metricValue).eventValue, metricValue, 'transformed custom event gauge value must be the same as original value');
            done();
        });
    });

    describe('when transforming sets', function(){
        it('should have the correct set value transformed', function(done){
            var metricValue = flush.timers['statsd.sampleset1'];
            assert.equal(transformer.customMetric.sets(metricValue), metricValue, 'transformed custom metric sets value must be the same as original value');
            assert.equal(transformer.customEvent.sets(metricValue).eventValue, metricValue, 'transformed custom event sets value must be the same as original value');
            done();
        });
    });

    describe('when transforming timers', function(){
        it('should have the correct timer value transformed', function(done){
            var metricArray = flush.timers['statsd.emptytimer'];
            assert.equal(transformer.customMetric.timers(metricArray), 0, 'transformed custom metric timer value for empty array must be zero');
            assert.equal(transformer.customEvent.timers(metricArray).eventValue, 0, 'transformed custom event timer value for empty array must be zero');

            metricArray = flush.timers['statsd.sampletimer'];
            var transformed = transformer.customMetric.timers(metricArray);
            assert.isObject(transformed, 'transformed custom metrictimer value must be an object when array is not empty');
            assert.equal(transformed.min, 1, 'transformed custom metric timer value must contain a min value of 1');
            assert.equal(transformed.max, 6, 'transformed custom metric timer value must contain a max value of 6');
            assert.equal(transformed.count, 6, 'transformed custom metric timer value must contain a count value of 6');
            assert.equal(transformed.total, 21, 'transformed custom metric timer value must contain a total value of 21');
            assert.equal(transformed.sumOfSquares, 91, 'transformed custom metric timer value must contain a sumOfSquares value of 911');

            transformed = transformer.customEvent.timers(metricArray);
            assert.isObject(transformed, 'transformed custom event timer value must be an object when array is not empty');
            assert.equal(transformed.min, 1, 'transformed custom event timer value must contain a min value of 1');
            assert.equal(transformed.max, 6, 'transformed custom event timer value must contain a max value of 6');
            assert.equal(transformed.count, 6, 'transformed custom event timer value must contain a count value of 6');
            assert.equal(transformed.total, 21, 'transformed custom event timer value must contain a total value of 21');
            assert.equal(transformed.sumOfSquares, 91, 'transformed custom event timer value must contain a sumOfSquares value of 911');

            done();
        });
    });
});