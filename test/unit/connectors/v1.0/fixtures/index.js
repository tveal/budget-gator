import fs from 'fs';
import sinon from 'sinon';
import { get } from 'lodash';
import { createAggregateMocker, createObjectMocker } from '../../../../fixtures/ObjectMocker';
import { TestFilesystem } from './filesystem';

export const TestConnector = {
  ...createAggregateMocker(),
  api: {
    filesystem: TestFilesystem.apiMocker,
  },
};

export const TestExternalConnector = {
  ...createObjectMocker({
    mockDisplayName: 'ExternalConnector',
    mockReturns: () => ({
      writeFileSync: () => undefined,
    }),
  }),
  use() {
    this.reset();

    const getObjectForMock = mock => get({
      // for other object mock support
      // get: axios,
      // post: axios,
      // put: axios,
      // delete: axios,
    }, mock, fs);

    Object.keys(this.mocks).forEach(mock => {
      sinon.stub(getObjectForMock(mock), mock)
        .callsFake((...args) => {
          // stringify-then-parse to remove functions for comparison
          this.requests.push({ args: JSON.parse(JSON.stringify(args)), action: mock });
          return this.mocks[mock](...args);
        });
    });
  },
};
