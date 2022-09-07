import { DedekindCompletion } from '../../src/graph/dedekind';

describe('the DedekindCompletion', () => {
  it('Should allow making a cut in a set', () => {
    const d = new DedekindCompletion<string>();
    d.S = ['a', 'b', 'c', 'd'];
    d.cut = 2;
    expect(d.U).toEqual(['c','d']);
    expect(d.L).toEqual(['a', 'b']);
    expect(d.oneSided).toBe(false);
  });

  it('Should allow swaping out the lower cut in a set', () => {
    const d = new DedekindCompletion<string>();
    d.S = ['a', 'b', 'c', 'd'];
    d.cut = 2;
    d.L = ['e', 'f', 'g'];
    expect(d.U).toEqual(['c','d']);
    expect(d.L).toEqual(['e', 'f', 'g']);
    expect(d.S).toEqual(['e', 'f', 'g', 'c','d'])
    expect(d.cut).toBe(3);
    expect(d.oneSided).toBe(false);
  });

  it('Should allow swaping out the upper cut in a set', () => {
    const d = new DedekindCompletion<string>();
    d.S = ['a', 'b', 'c', 'd'];
    d.cut = 2;
    d.U = ['e', 'f', 'g'];
    expect(d.U).toEqual(['e', 'f', 'g']);
    expect(d.L).toEqual(['a', 'b']);
    expect(d.S).toEqual(['a', 'b', 'e', 'f', 'g'])
    expect(d.cut).toBe(2);
    expect(d.S.length).toBe(5);
    expect(d.oneSided).toBe(false);
  });

  it('Should say it is onesided if it is', () => {
    const d = new DedekindCompletion<string>();
    d.S = ['a', 'b'];
    d.cut = 2;
    expect(d.oneSided).toBe(true);
    d.cut = 0;
    expect(d.oneSided).toBe(true);
  });
});
