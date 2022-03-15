
/**
 * Only allow number, string, or symbol for keys.
 */
export type VertexKeyType = number | string | symbol;

/**
 * Base Vertex Interface
 */
export interface IVertex {
  get key(): VertexKeyType;
}

/**
 * types for vertex sets
 */
export type VertexPair = [IVertex, IVertex];
export type VertexSet = IVertex[];
export type VertexSetSet = VertexSet[];

/**
 * This is a flexible graph vertex class. By default it can just use strings or
 * numbers as nodes, but it can use whatever data you want to through at it.
 * 
 * All it asks for is a method that can access the value used as a key for the
 * data, if it isn't the data itself.
 * 
 * Becauase of this flexibility, the resulting graph can actually traverse and
 * visit multiple types of objects along the travesed path as long as each object
 * has a unique field which can be used as a key.
 */
export class DataVertex<T> implements IVertex {
  protected _data: T;
  protected _key_accessor: (x: T) => VertexKeyType;
 
  constructor(data: T, key_accessor: (x: T) => VertexKeyType) {
    this._data = data;
    this._key_accessor = key_accessor;
  }
 
  /**
   * Gets the data
   */
  public get data(): T {
    return this._data;
  }

  /**
   * Sets the data
   */
  public set data(data: T) {
    this._data = data;
  }

  /**
   * Returns the key to the node. In the default case, this is the identity
   * function so it returns the object in _data directly.
   */
  public get key(): VertexKeyType {
    return this._key_accessor(this._data);
  }

  /**
   * Allows setting the key accessor function.
   */
  public set key_accessor(accessor: (x: T) => VertexKeyType) {
    this._key_accessor = accessor;
  }

  /**
   * Returns the key
   */
  public valueOf(): VertexKeyType {
    return this.key;
  }

  /**
   * Returns the key as the string representation
   */
  public toString(): string {
    return this.key.toString();
  }
}

/**
 * Example of a vertex implementation that only allows data of `VertexKeyType`
 */
export class KeyVertex extends DataVertex<VertexKeyType> {

  constructor(data: VertexKeyType) {
    super(data, KeyVertex.identity);
  }

  /**
   * By default, the identity function is used as the key accessor.
   */
  public static identity(x: VertexKeyType): VertexKeyType {
    return x;
  }
}
