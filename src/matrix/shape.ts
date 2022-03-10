/**
 * MatrixShape and related classes provide a level of type safety with
 * regard to the size of the Matrix.
 */
 export class MatrixShape {
    constructor(public rows: number, public cols: number) {
      if(!this.validate(rows, cols)) {
        throw Error('Incorrect sizes for matrix shape');
      }
    }
  
    public validate(rows: number, cols: number): boolean {
      return ( rows > 0 && cols > 0 );
    }
  
    public transpose(): MatrixShape {
      return new MatrixShape(this.cols, this.rows);
    }
  
    static match(rows: number, cols: number): MatrixShape {
      const shapes = [SquareShape, RowShape, ColumnShape, MatrixShape];
      let shape: MatrixShape = new MatrixShape(rows, cols);
      for (let i = 0; i < shapes.length; i++) {
        try {
          shape = new shapes[i](rows, cols);
          break;
        } catch(e) {
          // Silently try next shape
        }
      }
      return shape;
    }
  }
  
  /**
   * Creates a column shape, transposes to a row shape
   */
  export class ColumnShape extends MatrixShape {
    public override validate(rows: number, cols: number): boolean {
      return ( rows > cols && cols === 1 );
    }
  
    public override transpose(): RowShape {
      return new RowShape(this.cols, this.rows);
    }
  }
  
  /**
   * Creates a row shape, transposes to a column shape
   */
  export class RowShape extends MatrixShape {
    public override validate(rows: number, cols: number): boolean {
      return ( rows === 1 && cols > rows );
    }
  
    public override transpose(): ColumnShape {
      return new ColumnShape(this.cols, this.rows);
    }
  }
  
  /**
   * Creates a square shape
   */
  export class SquareShape extends MatrixShape {
    public override validate(rows: number, cols: number): boolean {
      return rows === cols;
    }
  
    public override transpose(): SquareShape {
      return new SquareShape(this.cols, this.rows);
    }
  }
  