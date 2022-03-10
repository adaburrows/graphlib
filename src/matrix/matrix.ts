import { MatrixShape, SquareShape } from './shape';

/**
 * This creates a row-major matrix initialized with zeros.
 */
export class Matrix {
  protected _shape: MatrixShape;
  protected _data: Array<Array<number>>;

  constructor(shape: MatrixShape) {
    this._shape = shape;
    this._data = [];

    for (let i = 0; i < this.shape.rows; i++) {
      const column = new Array(this._shape.cols).fill(0);
      this._data.push(column);
    }
  }

  /**
   * Returns the shape
   */
  public get shape(): MatrixShape {
    return this._shape;
  }

  /**
   * Returns the data
   */
  public get data(): Array<Array<number>> {
    return this._data;
  }

  /**
   * Sets the data
   */
  public set data(value: Array<Array<number>>) {
    // TODO: Check data and ensure it conforms to shape.
    this._data = value;
  }

  /**
   * Returns the tranpose of the matrix
   */
  public transpose(): Matrix {
    const T = new Matrix(this._shape.transpose());

    for (let i = 0; i < this._shape.cols; i++) {
      for (let j = 0; j < this._shape.rows; j++) {
          T._data[i][j] = this._data[j][i];
      }
    }

    return T;
  }

  /**
   * Computes the trace of a square matrix.
   */
  public trace(): number {
    let tr = 0;
    if (this._shape instanceof SquareShape) {
      tr = this._data.reduce((acc: number, row: Array<number>, i: number) => {
        return acc + row[i];
      }, 0);
    } else {
      throw Error('Cannot compute trace of non-square matrix');
    }
    return tr;
  }

  /**
   * Adds two matrices together
   */
  public add(B: Matrix): Matrix {
    const C = new Matrix(this._shape);

    if (B._shape.rows === this._shape.rows && B._shape.cols === this._shape.cols) {
      for (let i = 0; i < this._shape.rows; i++) {
        for (let j = 0; j < this._shape.cols; j++) {
          C._data[i][j] = this._data[i][j] + B._data[i][j];
        }
      }
    } else {
      throw Error('Size of matrices do not match.');
    }

    return C;
  }

  /**
   * Subtracts two matrices
   */
  public sub(B: Matrix): Matrix {
    const C = new Matrix(this._shape);

    if (B._shape.rows === this._shape.rows && B._shape.cols === this._shape.cols) {
      for (let i = 0; i < this._shape.rows; i++) {
        for (let j = 0; j < this._shape.cols; j++) {
          C._data[i][j] = this._data[i][j] - B._data[i][j];
        }
      }
    } else {
      throw Error('Size of matrices do not match.');
    }

    return C;
  }

  /**
   * Multiplies two matrices together.
   */
  public mult(B: Matrix): Matrix {
    const shp: MatrixShape = MatrixShape.match(this._shape.rows, B._shape.cols);
    const C = new Matrix(shp);

    if (this._shape.cols === B._shape.rows) {
      // Multiply matrices
      for (let i = 0; i < this._shape.rows; i++) {
        for (let j = 0; j < B._shape.cols; j++) {
          for (let k = 0; k < this._shape.cols; k++) {
            C._data[i][j] += this._data[i][k] * B._data[k][j]; 
          }
        }
      }
    } else {
      throw Error('RHS row count does not equal LHS col count.');
    }

    return C;
  }

  /**
   * Computes a matrix raised to the power of exp.
   */
   public pow(exp: number): Matrix {
    const A: Array<Matrix> = new Array(exp - 1).fill(this); 

    return A.reduce((P: Matrix, curr: Matrix) => {
      return P.mult(curr);
    }, this);
  }

}

/**
 * Creates an identity matrix conforming to the 
 */
export class IdentityMatrix extends Matrix {
  constructor(shape: MatrixShape) {
    super(shape);

    const n = Math.min(shape.rows, shape.cols);

    for (let i = 0; i < n; i++) {
      this._data[i][i] = 1;
    }
  }
}