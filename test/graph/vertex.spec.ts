import { DataVertex, KeyVertex} from '../../src';

describe('the DataVertex', () => {
  it('Should store an arbitrary object', () => {
    const data = {
      key: 'hi',
      other: 'data',
      more: 'data'
    };
    const key_accessor = (x: typeof data) => x.key
    const v = new DataVertex<typeof data>(data, key_accessor);
    expect(v.key).toBe(data.key);
    expect(v.data).toEqual(data);
  });
});

describe('the KeyVertex', () => {
  it('should store a number as a value and the key itself', () => {
    const v = new KeyVertex(1);
    expect(v.key).toBe(1);
    expect(v.data).toBe(1);
  });
  it('should convert the numeric value of the vertex key to a string', () => {
    const v = new KeyVertex(1);
    expect(v.toString()).toBe('1');
  });
  it('should store a string as a value and the key itself', () => {
    const v = new KeyVertex('hi');
    expect(v.key).toBe('hi');
    expect(v.data).toBe('hi');
    expect(v.toString()).toBe('hi');
  });
  it('should store a symbol as a value and the key itself', () => {
    const hi = Symbol('hi');
    const v = new KeyVertex(hi);
    expect(v.key).toBe(hi);
    expect(v.data).toBe(hi);
    expect(v.toString()).toBe(hi.toString());
  });
});