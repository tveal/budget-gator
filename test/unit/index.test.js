import { expect } from 'chai';
import { greetings } from '../../src';

describe('greetings', () => {
  it('should return greetings', () => {
    expect(greetings('Tester')).to.equal('Hello Tester!');
  });
});
