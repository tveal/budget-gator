import { expect } from 'chai';
import sinon from 'sinon';
import {
  isEqual, findIndex, isInteger, upperFirst,
} from 'lodash';

export const createObjectMocker = ({
  mockDisplayName,
  objectToMock,
  mockReturns = () => { },
  nest,
}) => ({
  name: `Test${upperFirst(mockDisplayName)}`,
  requests: [],
  objectToMock,
  mocks: mockReturns(),
  reassignMock(action, newMock) {
    this.mocks[action] = newMock;
    return this;
  },
  empty() {
    this.requests = [];
    return this;
  },
  reset() {
    this.empty();
    this.mocks = mockReturns();
    return this;
  },
  use() {
    this.reset();

    if (!nest) {
      Object.keys(this.mocks).forEach(mock => {
        sinon.stub(objectToMock, mock)
          .callsFake(params => {
            this.requests.push({ params, action: mock });
            return this.mocks[mock](params);
          });
      });
    } else {
      const nestStubs = {};
      Object.keys(this.mocks).forEach(mock => {
        nestStubs[mock] = params => {
          this.requests.push({ params, action: mock });
          return this.mocks[mock](params);
        };
      });
      sinon.stub(this.objectToMock, nest).callsFake(() => nestStubs);
    }
  },
  shouldHaveRequest(request, index) {
    const actualIndex = isInteger(index) ? index : findIndex(this.requests, e => isEqual(e, request));
    const matched = this.requests[actualIndex];
    const failMsg = `Failed to find matching request in ${this.name}; Actual requests: ${JSON.stringify(this.requests, null, 2)}`;
    if (isInteger(index)) {
      expect(matched).to.deep.equal(request);
    } else {
      expect(matched, failMsg).to.deep.equal(request);
    }
    this.requests.splice(actualIndex, 1);
    return this;
  },
  shouldHaveTotalRequests(count) {
    expect(this.requests.length).to.equal(count);
    return this;
  },
  printRequests(stringify = false) {
    const message = `${this.name} current requests:`;
    if (stringify) {
      console.log(message, JSON.stringify(this.requests, null, 2));
    } else {
      console.log(message, this.requests);
    }
    return this;
  },
});

export const createAggregateMocker = (objectMockers = { mocker1: createObjectMocker({}) }) => ({
  api: objectMockers,
  mockers() {
    return Object.values(this.api);
  },
  findMockerByAction(action) {
    return this.mockers().find(m => m.mocks[action]);
  },
  reassignMock(action, newMock) {
    const mocker = this.findMockerByAction(action);
    mocker.mocks[action] = newMock;
    return this;
  },
  empty() {
    this.mockers().forEach(m => m.empty());
  },
  reset() {
    this.mockers().forEach(m => m.reset());
    return this;
  },
  use() {
    this.mockers().forEach(m => m.use());
    return this;
  },
  shouldHaveRequest(request, index) {
    const mocker = this.findMockerByAction(request.action);
    const actualIndex = isInteger(index) ? index : findIndex(mocker.requests, e => isEqual(e, request));
    const matched = mocker.requests[actualIndex];
    const failMsg = `Failed to find matching request in ${mocker.name}; Actual requests: ${JSON.stringify(mocker.requests, null, 2)}`;
    if (isInteger(index)) {
      expect(matched).to.deep.equal(request);
    } else {
      expect(matched, failMsg).to.deep.equal(request);
    }
    mocker.requests.splice(actualIndex, 1);
    return this;
  },
  shouldHaveTotalRequests(count) {
    const requests = this.mockers().flatMap(m => m.requests);
    expect(requests.length).to.equal(count);
    return this;
  },
  printRequests(stringify = false) {
    this.mockers().forEach(m => m.printRequests(stringify));
    return this;
  },
});
