# StatsD backend for New Relic

## Overview
This is a pluggable backend for [StatsD](https://github.com/etsy/statsd), which publishes stats to [New Relic](https://www.newrelic.com).

## How it works
This backend uses the [New Relic agent](https://docs.newrelic.com/docs/agents/nodejs-agent/getting-started/new-relic-nodejs) 
library to send metrics data directly to a configured New Relic app.

## Installation

First you need to get the backend plugin by simply cloning it from the git repository:

    $ git clone https://github.com/mpayetta/statsd-newrelic-backend.git

Then install dependencies:

    $ cd statsd-newrelic-backend
    $ npm install
    
Copy the sample newrelic-config.js file into a newrelic.js file (check for other configuration options in the [configuration section](#configsection)):

    $ cp newrelic-config.js newrelic.js
    
Edit the app_name and license_key with you app and license key data:

    {
        app_name: ['Your new relic app name here'],
        license_key: 'Your new relic license key here',
    }
    
Finally, point your StatsD server to the New Relic backend index.js file by adding it to the backends array in your StatsD config.js:

    {
    	...
    	backends: ['path_to_statsd-newrelic-backend/lib/index.js']
    	...
    }    

Restart your StatsD server and metrics will start to flow to your New Relic app.

## <a name="configsection"></a> Configuration

### New Relic Agent
According the the node.js [agent configuration docs](https://docs.newrelic.com/docs/agents/nodejs-agent/installation-configuration/configuring-nodejs)
There are several ways to configure the agent. This backend supports all of them and are listed below:

#### Server side configuration
This configuration is the first one in the hierarchy and overrides all other settings unless disabled. You can configure
your app on the server side directly from your New Relic account. For more info look [here](https://docs.newrelic.com/docs/agents/nodejs-agent/installation-configuration/configuring-nodejs#ui_settings)

#### Environment variables
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

#### StatsD config.js file
The last option is to add two new configuration properties to the StatsD config file: `newRelicLicense` and `newRelicApp`

    {
          port: ...,
          backends: [ ... ],
          newRelicLicense: 'YOUR_LICENSE_KEY_HERE',
          newRelicApp: 'YOUR_APP_NAME_HERE'
    }

This method will use the environment variables configuration by setting them right before the New Relic agent is 
initialized.

### StatsD Backend 
There are a few configuration options for the backend. They must all be provided in the StatsD config.js file.

#### flushMetrics
Default: `['gauges', 'counters']`
You can configure which StatsD metrics should be sent to New Relic, by default only gauges and counters will be sent.
   
    {
        ...
        flushMetrics: ['gauges', 'counters', ...]
    }
    
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

## Dependencies
- [newrelic](https://www.npmjs.com/package/newrelic)
- [lodash](https://www.npmjs.com/package/lodash)