#!/usr/bin/env node

import * as yargs from 'yargs';
import * as log from 'log-util';
import * as cosmiconfig from 'cosmiconfig';
import * as updateNotifier from 'update-notifier';

import toc, { Options } from './commands/toc';

async function configureYargs() {
  const explorer = cosmiconfig('gds');
  const cosmiconfigResult = await explorer.search();
  const { config = {} } = cosmiconfigResult || {};

  return yargs
    .config(config)
    .options({
      cwd: {
        type: 'string',
        default: process.cwd(),
        desc: 'working directory',
      },
      logLevel: {
        type: 'number',
        default: 1,
        desc: 'log level',
      },
      linkPrefix: {
        type: 'string',
        demandOption: 'linkPrefix is required',
        desc: 'link prefix',
      },
      readme: {
        type: 'string',
        desc: 'readme content before TOC',
        default: '',
      },
    })
    .help()
    .version().argv._;
}

(async function() {
  try {
    await configureYargs();
    updateNotifier({ pkg: require('../package.json') }).notify();
    const { cwd, logLevel, linkPrefix, readme } = yargs.argv;
    const options: Options = {
      cwd: cwd as string,
      logLevel: logLevel as number,
      linkPrefix: linkPrefix as string,
      readme: readme as string,
    };
    await toc(options);
  } catch (e) {
    log.error(e.message);
    log.debug(e.stack);
    process.exit(1);
  }
})();
