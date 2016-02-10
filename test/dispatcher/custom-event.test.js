/*jslint unparam: true, node: true */
/*global describe, it, beforeEach */
'use strict';

var sinon = require('sinon'),
    assert = require('chai').assert;

var prefixes = {
    counters: 'Counters',
    timers: 'Timers'
};

var newrelicSpy;
var newrelic = { };

var singleTableName = "T";
var ipInstance = "127.0.0.1";
var dispatchCustomEvent = require('../../lib/dispatcher/dispatchers/custom-event')(newrelic, prefixes);
var dispatchCustomEventSingleTable = require('../../lib/dispatcher/dispatchers/custom-event')(newrelic, prefixes, {singleTable: true, tableName: singleTableName, machine_ip: ipInstance});

describe('custom event dispatcher test', function () {

    beforeEach(function () {
        newrelicSpy = sinon.spy();
        newrelic.recordCustomEvent = newrelicSpy;
    });

    describe('when dispatching a counter custom event', function () {
        it('should call successfully new relic recordCustomEvent api', function (done) {
            dispatchCustomEvent('counters', 'some.counter.key', 123);
            assert(newrelicSpy.calledOnce);
            assert(newrelicSpy.calledWith('Counters_some_counter_key', { eventValue: 123 }),
                'recordCustomEvent must be called');

            done();
        });
    });


    describe('when dispatching a counter custom event with single table', function () {
        it('should call successfully new relic recordCustomEvent api', function (done) {
            dispatchCustomEventSingleTable('counters', 'some.counter.key', 123);
            assert(newrelicSpy.calledOnce);
            assert(newrelicSpy.calledWith(singleTableName, { "eventValue": 123, "metricName": 'Counters_some_counter_key', "instance_ip": ipInstance}),
                'recordCustomEvent must be called');

            done();
        });
    });

    describe('when dispatching a timer custom event', function () {
        it('should call successfully new relic recordCustomEvent api', function (done) {
            dispatchCustomEvent('timers', 'some.timer.key', [0, 5, 4, 6, 7]);
            assert(newrelicSpy.calledOnce);
            assert(newrelicSpy.calledWith('Timers_some_timer_key', { min: 0, max: 7, total: 22, count: 5, sumOfSquares: 126}),
                    'recordCustomEvent must be called');

            done();
        });
    });





});