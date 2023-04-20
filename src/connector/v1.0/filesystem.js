import { createReadStream } from 'fs';
import { parse } from '@fast-csv/parse';
import {
  log,
  ensureAsync,
  appendCaptureData,
  clearCaptureData,
} from '../../utils';

export default () => ({
  importCsv({
    path,
    onRow = () => {},
  }) {
    const identifier = 'importCsv';
    clearCaptureData(identifier);
    appendCaptureData(identifier, '[');

    const processors = [];
    return new Promise((resolve, reject) => {
      createReadStream(path)
        .pipe(parse({ headers: true }))
        .on('error', error => reject(error))
        .on('data', row => {
          appendCaptureData(identifier, `${JSON.stringify(row, null, 2)},`);
          log.debug(row);
          processors.push(ensureAsync(onRow, row));
        })
        .on('end', rowCount => {
          appendCaptureData(identifier, ']');
          log.info(`Parsed ${rowCount} rows.`);
          resolve(Promise.all(processors).then(() => ({ processed: rowCount })));
        });
    });
  },
});
