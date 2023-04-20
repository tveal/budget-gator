import DEBUG from 'debug';

export const createLogger = app => {
  const log = {
    info: '',
    error: '',
    debug: '',
  };
  Object.keys(log).forEach(level => {
    let loggerPrefix = level;
    if (app) {
      loggerPrefix = `${level}:${app}`;
    }
    log[level] = DEBUG(loggerPrefix);
    // log[level].log = console.log.bind(console); // send to stdout instead of stderr
  });
  return log;
};

export const log = createLogger();
