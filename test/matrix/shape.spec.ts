import { MatrixShape, RowShape, ColumnShape, SquareShape } from '../../src';

describe('The Matrix shape and derrived classes', () => {

  it('Given, 1x3, the MatrixShape.match should return a RowShape', () => {
    const a = MatrixShape.match(1,3);
    expect(a instanceof RowShape).toBe(true);
  });

  it('Given, 3x1, the MatrixShape.match should return a ColumnShape', () => {
    const a = MatrixShape.match(3,1);
    expect(a instanceof ColumnShape).toBe(true);
  });

  it('Given, 3x3, the MatrixShape.match should return a SquareShape', () => {
    const a = MatrixShape.match(3,3);
    expect(a instanceof SquareShape).toBe(true);
  });

  it('Given, 2x3, the MatrixShape.match should return a MatrixShape', () => {
    const a = MatrixShape.match(2,3);
    expect(a instanceof MatrixShape).toBe(true);
  });

  it('Given a 1x3 RowShape, transpose should return a ColumnShape', () => {
    const a = (new RowShape(1,3)).transpose();
    expect(a instanceof ColumnShape).toBe(true);
  });

  it('Given a 3x1 ColumnShape, transpose should return a RowShape', () => {
    const a = (new ColumnShape(3,1)).transpose();
    expect(a instanceof RowShape).toBe(true);
  });

  it('Given an invalid 3x1 RowShape, it should throw an error', () => {
    expect(() => new RowShape(3,1)).toThrow('Incorrect sizes for matrix shape');
  });

  it('Given an invalid 1x3 ColumnShape, it should throw an error', () => {
    expect(() => new ColumnShape(1,3)).toThrow('Incorrect sizes for matrix shape');
  });

  it('Given an invalid 1x3 SquareShape, it should throw an error', () => {
    expect(() => new SquareShape(1,3)).toThrow('Incorrect sizes for matrix shape');
  });
});
  