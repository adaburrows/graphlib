import {VertexKeyType, VKSetSet, VKSet, VKPair } from './vertex';

/*

After much thought (see docs/summary.md), I think I want to refactor these
structures differently. I want to create a SimplicalSet<T>. This will allow
deriving much more complicated structures and types, like a generalized path
over SimplicalSets.

Eventually, Edge will derrive via SimplicalSet:

class Simplex<T> {
  public delta: Array<Array<T>>;
  constructor() {
    // Placeholder for the actual NArySimplex constructor
    this.delta = new Array<Array<T>>();
  }
}

function MakeSimplex<T>(N: number) {
  return class NArySimplex extends Simplex<T> {
    constructor() {
      super();
      this.delta = new Array<Array<T>>(N);
      for (let i = 0; i < N; i++) {
        this.delta[i] = new Array<T>();
      }
    }
  }
}

class Path<T> {
  public simplices: Array<Simplex<T>>;
  constructor() {
    this.simplices = new Array<Simplex<T>>();
  }
}

const EdgeSimplex = MakeSimplex<VertexKeyType>(1);

const a = new EdgeSimplex();
a.delta[0] = ['a'];
a.delta[1] = ['b'];

const b = new EdgeSimplex();
b.delta[0] = ['b'];
b.delta[1] = ['c'];

const c = new (MakeSimplex<VertexKeyType>(2))();
c.delta[0] = ['c'];
c.delta[1] = ['d'];
c.delta[2] = ['e'];

const path = new Path<VertexKeyType>();
path.simplices.concat([a,b,c]);

export class Edge extends EdgeSimplex implements IEdge {}

Additionally, I want to flatten the constructor signatures. No more passing in
arrays of arrays or unnecessary arrays, it should match the reality of the type
and what its vertex morphisms accept or return.

*/

/**
 * Interface for edges.
 */
export interface IEdge {
  vertices: VKSetSet;
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
  public vertices: VKSetSet;
  constructor() {
    this.vertices = [new Array<VertexKeyType>(), new Array<VertexKeyType>()];
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
  constructor(vertexPair: VKPair) {
    super();

    // This memory layout also maps directly to an UndirectedHyperedge
    this.vertices[0][0] = vertexPair[0];
    this.vertices[0][1] = vertexPair[1];
  }

  get x(): VertexKeyType {
    return this.vertices[0][0];
  }

  set x(v: VertexKeyType) {
    this.vertices[0][0] = v;
  }

  get y(): VertexKeyType {
    return this.vertices[0][1];
  }

  set y(v: VertexKeyType) {
    this.vertices[0][1] = v;
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
    return new DirectedEdge([this.x, this.y]);
  }

  /**
   * Returns a left oriented directed edge: x <-- y
   */
  public toLeft(): DirectedEdge {
    return new DirectedEdge([this.y, this.x]);
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
  constructor(vertexPair: VKPair) {
    super();

    // This memory layout also maps directly to a DirectedHyperedge
    this.vertices[0][0] = vertexPair[0];
    this.vertices[1][0] = vertexPair[1];
  }

  get t(): VertexKeyType {
    return this.vertices[0][0];
  }

  set t(v: VertexKeyType) {
    this.vertices[0][0] = v;
  }

  get h(): VertexKeyType {
    return this.vertices[1][0];
  }

  set h(v: VertexKeyType) {
    this.vertices[1][0] = v;
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
    return new UndirectedEdge([this.t, this.h]);
  }
}

/**
 * The base hyperedge type from which all hyperedges are derrived.
 */
export abstract class Hyperedge extends Edge implements IHyperedge {
  constructor(vertices: VKSet) {
    super();

    // Shallow copy of unique vertices
    this.vertices[0] = this.unique(vertices);
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
    return this.vertices[0].length;
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
    this.vertices[1] = this.unique(t);
  }

  get t(): VKSet {
    return this.vertices[0];
  }

  set t(v: VKSet) {
    this.vertices[0] = v;
  }

  get h(): VKSet {
    return this.vertices[1];
  }

  set h(v: VKSet) {
    this.vertices[1] = v;
  }

  /**
   * Returns the size of the hyperedge
   * Since a directed hyperedge uses both entries of the vertices, this is the
   * sum of the lengths of those entries.
   */
  public override get size(): number {
    return this.vertices[0].length + this.vertices[1].length;
  }

  /**
   * Is the edge a loop?
   * This is a strict logical AND accumulator.
   * This assumes no key collisions across the whole dataset.
   */
  override get isLoop(): boolean {
    const lengthEqual = this.vertices[0].length === this.vertices[1].length;

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
