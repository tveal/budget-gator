/* eslint-disable camelcase */
import { get } from 'lodash';
import { v1_0 } from './v1.0';

// load pattern to support version migrations
export const loadConnector = (apiVersion = 'v1_0') => get({
  v1_0,
}, apiVersion, v1_0)();
