import filesystem from './filesystem';

export const createApi = () => ({
  version: '1.0',

  ...filesystem(),
});
