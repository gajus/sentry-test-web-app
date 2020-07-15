const path = require('path');
const yargs = require('yargs');
const express = require('express');
const serveStatic = require('serve-static');

const argv = yargs
  .env('TEST')
  .options({
    'service-port': {
      default: 8080,
      demand: true,
      type: 'number',
    },
  })
  .argv;

const app = express();

const server = app.listen(argv.servicePort, '0.0.0.0');

app.use('/static', serveStatic(path.resolve(__dirname, '../dist'), {
  index: false,
}));

app.get('*', (request, response) => {
  let styles = '';
  let scripts = '';

  const manifest = require('../dist/manifest.json');

  scripts = '<script src="static/' + manifest['main.js'] + '"></script>';

  const globalState = {
    sentry: null,
  };

  if (process.env.SENTRY_DSN) {
    globalState.sentry = {
      dsn: process.env.SENTRY_DSN,
      environment: process.env.SENTRY_ENVIRONMENT,
      release: process.env.SENTRY_RELEASE,
    };
  }

  response.send(`<html>
  <body>
    <div id='root'></div>
    <script>
    window.CWA = ${JSON.stringify(globalState)};
    </script>
    ${scripts}
  </body>
</html>`);
});

