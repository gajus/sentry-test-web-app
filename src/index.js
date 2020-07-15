// @flow

import * as Sentry from '@sentry/browser';
import {RewriteFrames} from '@sentry/integrations';

Sentry.init({
  debug: true,
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT,
  release: process.env.SENTRY_RELEASE,
  integrations: [new RewriteFrames()],
});

const foo = () => {
  throw new Error('Something broke');
};

const bar = () => {
  foo();
};

(async () => {
  if (Math.random() > 0.5) {
    bar();
  }
})();
