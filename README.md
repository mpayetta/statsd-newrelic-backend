# StatsD backend for New Relic

## Overview
This is a pluggable backend for [StatsD](https://github.com/etsy/statsd), which publishes stats to [New Relic](https://www.newrelic.com).

## How it works
This backend uses the [New Relic agent](https://docs.newrelic.com/docs/agents/nodejs-agent/getting-started/new-relic-nodejs) 
library to send metrics data directly to a configured New Relic app.

## Installation

First you need to get the backend plugin by simply doing:

    $ npm install statsd-newrelic-backend
        
Then, point your StatsD server to the New Relic backend index.js file by adding it to the backends array in your StatsD config.js.

Finally add your app name and license key to the config.js file (or follow any of the configuration options described [here](#configsection)).

In the end your config.js file will look like this:

<a name="installation-config"></a> **Example configuration**
    
    {
    	...
    	backends: ['statsd-newrelic-backend'],
    	newRelicLicense: 'YOUR_LICENSE_KEY_HERE',
        newRelicApp: 'YOUR_APP_NAME_HERE'
    	...
    }    

Restart your StatsD server and metrics will start to flow to your New Relic app.

## <a name="configsection"></a> Configuration

### New Relic Agent Configuration
According the the node.js [agent configuration docs](https://docs.newrelic.com/docs/agents/nodejs-agent/installation-configuration/configuring-nodejs)
There are several ways to configure the agent. This backend supports all of them and are listed below:

#### StatsD config.js file
The easiest option is to add two new configuration properties to the StatsD config file: `newRelicLicense` and `newRelicApp`
as stated in the example config in the [Installation](#installation-config) section.
This method will set the [Environment Variables](#env-var) right before the New Relic agent is initialized.

#### Server side configuration
This configuration is the first one in the hierarchy and overrides all other settings unless disabled. You can configure
your app on the server side directly from your New Relic account. For more info look [here](https://docs.newrelic.com/docs/agents/nodejs-agent/installation-configuration/configuring-nodejs#ui_settings)

#### <a name="env-var"></a> Environment variables
You can set different environment variables in your server to configure the New Relic agent. For more information look [here](https://docs.newrelic.com/docs/agents/nodejs-agent/installation-configuration/configuring-nodejs-environment-variables)

#### newrelic.js configuration file
In the root of this project there's a `newrelic-config.js` file which is an example configuration file. You just need to copy it:

    $ cp newrelic-config.js newrelic.js
    
**IMPORTANT**: the new file name **MUST** be `newrelic.js`, otherwise the agent will not find it

And edit the app_name and license_key with you app and license key data:

    {
        app_name: ['Your new relic app name here'],
        license_key: 'Your new relic license key here',
    }

### StatsD Backend Configuration
There are a few configuration options for the backend. They must all be provided in the StatsD config.js file.

#### dispatchMetrics
Default: `['gauges', 'counters']`
You can configure which StatsD metrics should be sent to New Relic, by default only gauges and counters will be sent.
   
Usage:


    {
        ...
        dispatchMetrics: ['gauges', 'counters', ...]
        ...
    }
    
#### dispatchers
Default: `['customEvent']`
Dispatchers are functions which send metrics to new relic using different APIs. There are 2 dispatchers available:

- customMetric: will send metrics to new relic as [custom metrics](https://docs.newrelic.com/docs/apm/other-features/metrics/custom-metrics)
- customEvent: will send metrics to new relic as [insights custom events](https://docs.newrelic.com/docs/insights/new-relic-insights/understanding-insights/new-relic-insights)
   
Usage:


    {
        ...
        dispatchers: ['customEvent', 'customMetric']
        ...
    }
    
#### globalMetricPrefix
Default: `null`

The `globalMetricPrefix` option allows you to set a global prefix for all StatsD metrics. The prefix will be appended
to the Custom metric name sent to New Relic, so that it will look like this: `Custom/GlobalPrefix/statsd.metric.key`

This metric will **override** any custom prefixes configured in the `customMetricPrefix` option.

#### customMetricPrefix
Default:
    
    {
        gauges: 'Gauges',
        timers: 'Timers',
        counters: 'Counters',
        sets: 'Sets'   
    }

You can configure the New Relic custom metric names. By default all metric names will be `Custom/metric.key`
Every type of StatsD metric must be a key in the `customMetricPrefix` object:

Usage:

    {
        customMetricPrefix: {
            ... 
            gauges: 'Gauges',
            timers: 'SomeNameForTimers'
            ...
        }
    }
   
The example above will send the gauges metrics as `Custom/Gauges/metric.key` and the timers as `Custom/SomeNameForTimers/metric.key`
where `metric.key` is the StatsD metric key.

## Tests
Tests can be run with gulp using the mocha task:

`gulp mocha`

## Dependencies
- [newrelic](https://www.npmjs.com/package/newrelic)
- [lodash](https://www.npmjs.com/package/lodash)


## License
See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).



This plugin was developed with the help of the guys from [Takipi](https://www.takipi.com)