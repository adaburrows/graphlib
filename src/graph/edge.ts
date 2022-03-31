import { VertexKeyType, VKSet } from './vertex';
import { DedekindCompletion } from './dedekind';

/**
 * Interface for edges.
 */
export interface IEdge {
  vertices: DedekindCompletion<VertexKeyType>;
  isLoop: boolean;
}

/**
 * Interface for hyperedges.
 *   Adds size property.
 */
export interface IHyperedge extends IEdge {
  size: number;
}

/**
 * The base edge type from which all edges are derrived from.
 */
export abstract class Edge implements IEdge{
  public vertices: DedekindCompletion<VertexKeyType>;
  constructor() {
    this.vertices = new DedekindCompletion<VertexKeyType>();
  }

  get isLoop(): boolean {
    throw Error("isLoop() not implemented");
  }
}

/**
 * Undirected edge:
 * Has morphisms x and y mapping to vertex elements.
 * Has functors which map onto: 
 *   hyperedge,
 *   oriented directed edges,
 *   and oriented directed hyperedges
 */
export class UndirectedEdge extends Edge {
  constructor(x: VertexKeyType, y: VertexKeyType) {
    super();
    this.vertices.S = [x, y];
  }

  get x(): VertexKeyType {
    return this.vertices.S[0];
  }

  set x(v: VertexKeyType) {
    this.vertices.S[0] = v;
  }

  get y(): VertexKeyType {
    return this.vertices.S[1];
  }

  set y(v: VertexKeyType) {
    this.vertices.S[1] = v;
  }

  /**
   * Is the edge a loop?
   * This assumes no key collisions across the whole dataset.
   * TODO:
   * Theoretically, this could be represented the same way as it is in the
   * UndirectedHyperedge. When there is a loop, we could automatically reduce it
   * to not have a `y` element. The question is should we?
   */
  override get isLoop(): boolean {
    return this.x == this.y;
  }

  /**
   * Returns a right oriented directed edge: x --> y
   */
  public toRight(): DirectedEdge {
    return new DirectedEdge(this.x, this.y);
  }

  /**
   * Returns a left oriented directed edge: x <-- y
   */
  public toLeft(): DirectedEdge {
    return new DirectedEdge(this.y, this.x);
  }

  /**
   * Returns a right oriented directed hyperedge: x --> y
   */
   public toRightHyperedge(): DirectedHyperedge {
    return new DirectedHyperedge([this.x], [this.y]);
  }

  /**
   * Returns a left oriented directed hyperedge: x <-- y
   */
  public toLeftHyperedge(): DirectedHyperedge {
    return new DirectedHyperedge([this.y], [this.x]);
  }

  /**
   * Returns an undirected hyperedge.
   */
  public toUndirectedHyperedge(): Hyperedge{
    return new UndirectedHyperedge([this.x, this.y]);
  }
}

/**
 * Directed edge:
 *   Has morphisms t and h mapping to vertex elements.
 *   Points from t(ail) --> h(ead)
 */
export class DirectedEdge extends Edge {
  constructor(t: VertexKeyType, h: VertexKeyType) {
    super();
    this.vertices.L = [t];
    this.vertices.U = [h];
  }

  get t(): VertexKeyType {
    return this.vertices.L[0];
  }

  set t(v: VertexKeyType) {
    this.vertices.L = [v];
  }

  get h(): VertexKeyType {
    return this.vertices.U[0];
  }

  set h(v: VertexKeyType) {
    this.vertices.U = [v];
  }

  /**
   * Is the edge a loop?
   * This assumes no key collisions across the whole dataset.
   */
  override get isLoop(): boolean {
    return this.h == this.t;
  }

  /**
   * Returns a directed hyperedge.
   * TODO: just copy this.vertices since it has the right structure
   */
  public toDirectedHyperedge(): DirectedHyperedge {
    return new DirectedHyperedge([this.t], [this.h]);
  }

  /**
   * Returns an undirected edge.
   * TODO: If the underlying data structure is looked at as a matrix, this is
   * just the transpose, but at size two, it's not worth thinking about too much.
   */
  public toUndirectedEdge(): UndirectedEdge {
    return new UndirectedEdge(this.t, this.h);
  }
}

/**
 * The base hyperedge type from which all hyperedges are derrived.
 */
export abstract class Hyperedge extends Edge implements IHyperedge {
  constructor(vertices: VKSet) {
    super();

    // Shallow copy of unique vertices
    this.vertices.L = this.unique(vertices);
  }

  /**
   * Remove duplicates in `Hyperedge` `VKSet`s.
   */
  protected unique(vertices: VKSet): VKSet {
    return vertices.reduce<VKSet>((accum: VKSet, vertex: VertexKeyType): VKSet => {
      if(accum.length) {
        if(accum[0] != vertex) {
          accum.push(vertex);
        }
      } else {
        accum.push(vertex)
      }
      return accum;
    }, new Array<VertexKeyType>());
  }

  /**
   * Returns the size of the hyperedge
   * Since a hyperedge only uses the first entry of the vertices, this is the
   * length of that entry.
   */
  public get size(): number {
    return this.vertices.cardinality;
  }

  /**
   * Is the edge a loop?
   * This assumes no key collisions across the whole dataset.
   */
  override get isLoop(): boolean {
    return this.size == 1;
  }

  // Q: Should we write a functor going to mutitple edges?
}

/**
 * Undirected hyperedge:
 *   Nothing special about it, it's really just a set.
 */
export class UndirectedHyperedge extends Hyperedge {}

/**
 * Directed hyperedge:
 *   Extends the undirected hyperedge to be a directed hyperedge.
 *   Has morphisms t and h mapping to vertex elements.
 *   Points from t(ail) --> h(ead)
 */
export class DirectedHyperedge extends Hyperedge {
  constructor(h: VKSet, t: VKSet) {
    super(h);

    // Shallow copy of unique vertices
    this.vertices.U = this.unique(t);
  }

  get t(): VKSet {
    return this.vertices.L;
  }

  set t(v: VKSet) {
    this.vertices.L = v;
  }

  get h(): VKSet {
    return this.vertices.U;
  }

  set h(v: VKSet) {
    this.vertices.U = v;
  }

  /**
   * Returns the size of the hyperedge
   * Since a directed hyperedge uses both entries of the vertices, this is the
   * sum of the lengths of those entries.
   */
  public override get size(): number {
    return this.vertices.cardinality;
  }

  /**
   * Is the edge a loop?
   * This is a strict logical AND accumulator.
   * This assumes no key collisions across the whole dataset.
   */
  override get isLoop(): boolean {
    const lengthEqual = this.vertices.L.length === this.vertices.U.length;

    // Initialize accumulator with initial check result
    let loop = lengthEqual;

    // Shortcut the longer check if false
    if (loop) {
      // Make shallow copies of the vertex sets
      let t = [...this.t];
      let h = [...this.h];

      // Check for membership in the other set
      for (let e of t) {
        const i = h.indexOf(e);
        if (i > 0) {
          loop &&= true;

          // If it's found, remove it from the copy so there's fewer to compare next time around.
          h.splice(i, 1);
        }
      }
    }

    return loop;
  }

  /**
   * Is the edge a kind of loop? Returns true if the tail and head intersect.
   */
  //TODO: add get isLoopOr(): boolean

  // Q: Should we write a functor going to mutitple directed edges?
  // Q: Should we write a functor going to undirected hyperedges?
}
