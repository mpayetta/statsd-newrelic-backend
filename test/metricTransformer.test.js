'use strict';

var transformer = require('../lib/metricTransformer'),
    flush = require('./flushSample.js'),
    assert = require('chai').assert;

console.log(transformer);

describe('simple metric transformer test', function(){

    describe('transform counters', function(){
        it('checks that the counter value transformer works as expected', function(done){
            var metricValue = flush.timers['statsd.samplecounter1'];
            assert.equal(transformer.counters(metricValue), metricValue, 'transformed counter value must be the same as original value');
            done();
        });
    });

    describe('transform gauges', function(){
        it('checks that the gauge value transformer works as expected', function(done){
            var metricValue = flush.timers['statsd.samplegauge1'];
            assert.equal(transformer.gauges(metricValue), metricValue, 'transformed gauge value must be the same as original value');
            done();
        });
    });

    describe('transform sets', function(){
        it('checks that the sets value transformer works as expected', function(done){
            var metricValue = flush.timers['statsd.sampleset1'];
            assert.equal(transformer.sets(metricValue), metricValue, 'transformed sets value must be the same as original value');
            done();
        });
    });

    describe('transform timers', function(){
        it('checks that the timer value transformer works as expected', function(done){
            var metricArray = flush.timers['statsd.emptytimer'];
            assert.equal(transformer.timers(metricArray), 0, 'transformed timer value for empty array must be zero');

            metricArray = flush.timers['statsd.sampletimer'];
            var transformed = transformer.timers(metricArray);
            assert.isObject(transformed, 'transformed timer value must be an object when array is not empty');
            assert.equal(transformed.min, 1, 'transformed timer value must contain a min value of 1');
            assert.equal(transformed.max, 6, 'transformed timer value must contain a max value of 6');
            assert.equal(transformed.count, 6, 'transformed timer value must contain a count value of 6');
            assert.equal(transformed.total, 21, 'transformed timer value must contain a total value of 21');
            assert.equal(transformed.sumOfSquares, 91, 'transformed timer value must contain a sumOfSquares value of 911');

            done();
        });
    });
});