export * from './capture';
export * from './logger';

export const ensureAsync = async (func, ...args) => {
  const ret = await func(...args);
  return ret;
};
