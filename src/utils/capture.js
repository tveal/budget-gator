import {
  writeFileSync, appendFileSync, rmSync, existsSync,
} from 'fs';
import { isString } from 'lodash';
import { log } from './logger';

export const writeCaptureData = (identifier, data) => {
  const {
    path,
    dataToSave,
    shouldSave,
  } = getSaveParams(identifier, data);
  if (shouldSave) {
    log.debug(`Saving ${path}`);
    writeFileSync(path, dataToSave);
  }
};

export const appendCaptureData = (identifier, data) => {
  const {
    path,
    dataToSave,
    shouldSave,
  } = getSaveParams(identifier, data);

  if (shouldSave) {
    log.debug(`Appending to ${path}`);
    appendFileSync(path, dataToSave);
  }
};

export const clearCaptureData = (identifier, data) => {
  const {
    path,
    shouldSave,
  } = getSaveParams(identifier, data);

  if (shouldSave && existsSync(path)) {
    log.debug(`Deleting ${path}`);
    rmSync(path);
  }
};

const getSaveParams = (identifier, data) => {
  const shouldSave = ['true', true].includes(process.env.SAVE_CONNECTOR_RESPONSES);
  const dataToSave = !isString(data) ? JSON.stringify(data, null, 2) : data;
  const path = `${process.cwd()}/CaptureData.${identifier}.${getFileExt(dataToSave)}`;
  return {
    path,
    dataToSave,
    shouldSave,
  };
};

const getFileExt = data => {
  try {
    JSON.parse(data);
    return 'json';
  } catch {
    return 'txt';
  }
};
