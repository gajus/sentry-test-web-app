# test-web-app

This repository contains minimal setup required to demonstrate that Sentry source maps uploads do not work as expected.

```bash
npm install

webpack --config=./webpack.config.production.js

export NODE_ENV=production

export TEST_SERVICE_PORT='8080'

export SENTRY_DSN='https://...'
export SENTRY_RELEASE='test-web-app'
export SENTRY_AUTH_TOKEN='...'
export SENTRY_ENVIRONMENT='production'
export SENTRY_ORG='...'
export SENTRY_PROJECT='test-web-app'
export SENTRY_LOG_LEVEL='debug'

sentry-cli releases --org contra --project contra-web-app files 'test-web-app' upload-sourcemaps ./dist --no-rewrite --validate --wait --url-prefix '~/static'

node bin/server.js

```

## Symptoms

`sentry-cli` reports that source maps are correctly mapped:

```
[..]
> Found 2 release files
> Analyzing 2 sources
> Adding source map references
> Validating sources
  INFO    2020-07-15 13:33:18.631977 -05:00 validator found source (webpack://test-web-app/./node_modules/@sentry/core/esm/integrations/functiontostring.js)
  INFO    2020-07-15 13:33:18.632013 -05:00 validator found source (webpack://test-web-app/./node_modules/@sentry/core/esm/integrations/inboundfilters.js)
  INFO
[..]
Source Map Upload Report
  Minified Scripts
    ~/static/main.f6783fd6a676524bfe6e.js (sourcemap at main.f6783fd6a676524bfe6e.js.map)
  Source Maps
    ~/static/main.f6783fd6a676524bfe6e.js.map

```

Sentry assets are uploaded as:

```
~/static/main.f6783fd6a676524bfe6e.js
~/static/main.f6783fd6a676524bfe6e.js.map
```

However, [captured error](https://imgur.com/a/6tXMVMA) does not use source-maps, or at least it:

* does not identify that error originates in `./index.js` (instead it says `?(main.91909798907307c7d277.js)`)
* "App Only" trace is empty (https://imgur.com/a/s3Tyh7k)
* says "Invalid location in sourcemap" (`http://127.0.0.1:8080/static/main.1d919f425acbfeb1dbf2.js.map:1:21`) This location indeed does not exist in the source map.
* stack trace does include source and names of files/methods (https://imgur.com/a/WmJho4z)

There appears to be either:

* unnecessary frame that should not be sent (since it does not map to sourcemaps)
* source map error

## Notes

* Adding `integrations: [new RewriteFrames()],` makes no difference.
* Using `--rewrite` or `--no-rewrite` makes no difference.
* Using `source-map` or `hidden-source-map` makes no difference.