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
    
Copy the sample newrelic-config.js file into a newrelic.js file:

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


## Dependencies
- [newrelic](https://www.npmjs.com/package/newrelic)