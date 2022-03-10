import { RowShape, ColumnShape, SquareShape, Matrix, IdentityMatrix } from '../../src/';

const square3 = new SquareShape(3, 3);

const A = new Matrix(square3);
A.data = [
  [1, 2, 3],
  [3, 1, 2],
  [2, 3, 1]
];

const B = new Matrix(square3);
B.data = [
  [1, 3, 2],
  [2, 1, 3],
  [3, 2, 1]
];

const D = new Matrix(new RowShape(1, 4));
D.data = [
  [1, 2, 3, 4]
];

const E = new Matrix(new ColumnShape(4, 1));
E.data = [
  [1],
  [2],
  [3],
  [4]
];

const id =[
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
];

const sum = [
  [2, 5, 5],
  [5, 2, 5],
  [5, 5, 2]
];

const mult = [
  [(1*1+2*2+3*3), (1*3+2*1+3*2), (1*2+2*3+3*1)],
  [(3*1+1*2+2*3), (3*3+1*1+2*2), (3*2+1*3+2*1)],
  [(2*1+3*2+1*3), (2*3+3*1+1*2), (2*2+3*3+1*1)]
];

describe('The Matrix shape getter', () => {
  it('should return the proper size for A', () => {
    expect(A.shape.rows).toEqual(3);
    expect(A.shape.cols).toEqual(3);
  });
  
  it('should return the proper size for D', () => {
    expect(D.shape.rows).toEqual(1);
    expect(D.shape.cols).toEqual(4);
  });
  
  it('should return the proper size for E', () => {
    expect(E.shape.rows).toEqual(4);
    expect(E.shape.cols).toEqual(1);
  });
});

describe('The Matrix transpose method', () => {
  it('should return the transpose', () => {
    expect(D.transpose().data).toEqual(E.data);
  });
});

describe('The Matrix add method', () => {
  it('should add A and B', () => {
    const C = A.add(B);
    expect(C.data).toEqual(sum);
  });

  it('should throw an error when the sizes of matrices are not compatible', () =>{
    expect(() => { A.add(E) }).toThrow('Size of matrices do not match.');
  });
});

describe('The Matrix mult method', () => {
  it('should multiply A and B', () => {
    const C = A.mult(B);
    expect(C.data).toEqual(mult);
  });

  it('should throw an error when the sizes of matrices are not compatible', () =>{
    expect(() => { A.mult(E) }).toThrow('RHS row count does not equal LHS col count.');
  });

  it('should compute a product equal itself when multiplied by an identity matrix', () => {
    const I = new IdentityMatrix(square3);
    const A1 = I.mult(A);
    const A2 = A.mult(I);
    expect(A.data).toEqual(A1.data);
    expect(A.data).toEqual(A2.data);
  });
});

describe('The Matrix pow method', () => {
  it('should allow computing a power of a square matrix', () => {
    const S = new Matrix(square3);
    S.data = [
      [0, 1, 1],
      [1, 0, 1],
      [1, 1, 0]
    ];
    // The number of triangles formed by the above graph should be 1.
    expect(((S.pow(3)).trace())/6).toEqual(1);
  });

  it('should fail to multiply a non-square matrix', () => {
    expect(() => { D.pow(3); }).toThrow('RHS row count does not equal LHS col count');
  });
});

describe('The Identity class constructor', () => {
  it('should create an identity matrix', () => {
    const I = new IdentityMatrix(square3);
    expect(I.data).toEqual(id);
  });
});
