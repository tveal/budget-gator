import { expect } from 'chai';
import { basename } from 'path';
import sinon from 'sinon';
import { TestConnector } from './fixtures';
import filesystemApi from '../../../../src/connector/v1.0/filesystem';

const apiVersion = 'v1.0';
const fileName = basename(__filename).replace('.test.js', '');

describe(`Connector api ${apiVersion} ${fileName}`, () => {
  beforeEach(() => {
    TestConnector.use();
  });
  afterEach(() => {
    TestConnector.reset();
    sinon.restore();
    delete process.env.SAVE_CONNECTOR_RESPONSES;
  });
  describe('importCsv', () => {
    it('should importCsv and capture when SAVE_CONNECTOR_RESPONSES = true', async () => {
      process.env.SAVE_CONNECTOR_RESPONSES = true;
      const data = await filesystemApi().importCsv();

      expect(data).to.deep.equal({});

      TestConnector
        // .printRequests()
        .shouldHaveTotalRequests(1)
        .shouldHaveTotalRequests(0);
    });
  });
});

describe(`REAL api ${apiVersion} ${fileName}`, () => {
  afterEach(() => {
    delete process.env.SAVE_CONNECTOR_RESPONSES;
  });
  it.only('REAL importCsv', async () => {
    process.env.SAVE_CONNECTOR_RESPONSES = true;

    const data = await filesystemApi().importCsv({
      path: `${__dirname}/fixtures/raw/sample.csv`,
      onRow: row => console.log(JSON.stringify(row)),
    });

    console.log(data);
  }).timeout(42000);
});
