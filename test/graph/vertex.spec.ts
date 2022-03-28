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
    expect(v.key).toEqual(data.key);
    expect(v.data).toEqual(data);
  });
});

describe('the KeyVertex', () => {
  it('should store a number as a value and the key itself', () => {
    const v = new KeyVertex(1);
    expect(v.key).toEqual(1);
    expect(v.data).toEqual(1);
  });
  it('should convert the numeric value of the vertex key to a string', () => {
    const v = new KeyVertex(1);
    expect(v.toString()).toEqual('1');
  });
  it('should store a string as a value and the key itself', () => {
    const v = new KeyVertex('hi');
    expect(v.key).toEqual('hi');
    expect(v.data).toEqual('hi');
    expect(v.toString()).toEqual('hi');
  });
  it('should store a symbol as a value and the key itself', () => {
    const hi = Symbol('hi');
    const v = new KeyVertex(hi);
    expect(v.key).toEqual(hi);
    expect(v.data).toEqual(hi);
    expect(v.toString()).toEqual(hi.toString());
  });
});
