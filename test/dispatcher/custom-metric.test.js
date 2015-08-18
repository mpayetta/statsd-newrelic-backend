var sinon = require('sinon'),
    assert = require('chai').assert;

var prefixes = {
    counters: 'Counters',
    timers: 'Timers'
};

var newrelicSpy;
var newrelic = { }

var dispatchCustomMetric = require('../../lib/dispatcher/dispatchers/custom-metric')(newrelic, prefixes);

describe('custom metric dispatcher test', function() {

    beforeEach(function() {
        newrelicSpy = sinon.spy();
        newrelic.recordMetric = newrelicSpy;
    });

    describe('when dispatching a counter custom metric', function() {
        it('should call successfully new relic recordMetric api', function(done) {
            dispatchCustomMetric('counters', 'some.counter.key', 123);
            assert(newrelicSpy.calledOnce);
            assert(newrelicSpy.calledWith('Custom/Counters/some.counter.key', 123),
                'recordMetric must be called');

            done();
        });
    });

    describe('when dispatching a timer custom metric', function() {
        it('should call successfully new relic recordMetric api', function(done) {
            dispatchCustomMetric('timers', 'some.timer.key', [0, 5, 4, 6, 7]);
            assert(newrelicSpy.calledOnce);
            assert(newrelicSpy.calledWith('Custom/Timers/some.timer.key', { min: 0, max: 7, total: 22, count: 5, sumOfSquares: 126}),
                'recordMetric must be called');

            done();
        });
    })


});