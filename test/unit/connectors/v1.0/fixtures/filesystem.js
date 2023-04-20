import { createObjectMocker } from '../../../../fixtures/ObjectMocker';
import * as API from '../../../../../src/connector/v1.0/filesystem';

export const TestFilesystem = {
  apiMocker: createObjectMocker({
    mockDisplayName: 'FilesystemApi',
    objectToMock: API,
    nest: 'default',
    mockReturns: () => ({
      importCsv: () => Promise.resolve({}),
    }),
  }),
};
