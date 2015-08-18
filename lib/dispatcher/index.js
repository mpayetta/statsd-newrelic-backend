module.exports = function(newrelic, prefixes) {
    var exports = {
        customMetric: require('./dispatchers/custom-metric')(newrelic, prefixes),
        customEvent: require('./dispatchers/custom-event')(newrelic, prefixes)
    }
    return exports;
}