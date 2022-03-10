import { IVertex } from './vertex';

/*

If we reduce the graph to primitives, we can see that it is really just a set
of sets. A hyperedge has up to two sets. An edge in a graph has two elements.
The graph itself has a set of those sets. This implementation allows us to see
that the underlying type is the same across all edges.

We can see that each type of graph is really just a more restricted form of
a hypergraph, with graphs being 2-uniform hypergraphs (each edge of size 2).

*/

/**
 * Internally, we represent everything as a set of sets, which allows a simple
 * map from graph to hypergraph.
 */
export type VertexSetSet = VertexSet[];

/**
 * Edges and Arcs have only pair of vertices per edge.
 */
export type VertexPair = [IVertex, IVertex];

/**
 * Hypergraphs can have up to two vertex sets per edge.
 */
export type VertexSet = IVertex[];

/**
 * Interface for edges.
 */
export interface IEdge {
  vertices: VertexSetSet;
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
  public vertices: VertexSetSet;
  constructor() {
    this.vertices = new Array<IVertex[]>(2);
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
export class Undirected extends Edge {
  constructor(vertex_pair: VertexPair) {
    super();
    this.vertices[0] = vertex_pair;
  }

  get x(): IVertex {
    return this.vertices[0][0];
  }

  set x(v: IVertex) {
    this.vertices[0][0] = v;
  }

  get y(): IVertex {
    return this.vertices[0][1];
  }

  set y(v: IVertex) {
    this.vertices[0][1] = v;
  }

  /**
   * Returns a right oriented directed edge: x --> y
   */
  public toRight(): Directed {
    return new Directed([this.x, this.y]);
  }

  /**
   * Returns a left oriented directed edge: x <-- y
   */
  public toLeft(): Directed {
    return new Directed([this.y, this.x]);
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
 *   Has morphisms h and t mapping to vertex elements.
 */
export class Directed extends Edge {
  constructor(vertex_pair: VertexPair) {
    super();
    this.vertices[0] = vertex_pair;
  }

  get h(): IVertex {
    return this.vertices[0][0];
  }

  set h(v: IVertex) {
    this.vertices[0][0] = v;
  }

  get t(): IVertex {
    return this.vertices[0][1];
  }

  set t(v: IVertex) {
    this.vertices[0][1] = v;
  }

  /**
   * Returns a directed hyperedge.
   */
  public toDirectedHyperedge(): DirectedHyperedge {
    return new DirectedHyperedge([this.h], [this.t]);
  }

  /**
   * Returns an undirected edge.
   */
  public toUndirected(): Undirected {
    return new Undirected([this.h, this.t]);
  }
}

/**
 * The base hyperedge type from which all hyperedges are derrived.
 */
export abstract class Hyperedge extends Edge implements IEdge {
  constructor(vertices: VertexSet) {
    super();
    this.vertices[0] = vertices;
  }

  public get size(): number {
    return this.vertices[0].length;
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
 *  Extends the undirected hyperedge to be a directed hyperedge.
 */
export class DirectedHyperedge extends Hyperedge {
  constructor(h: VertexSet, t: VertexSet) {
    super(h);
    this.vertices[1] = t;
  }

  get h(): VertexSet {
    return this.vertices[0];
  }

  set h(v: VertexSet) {
    this.vertices[0] = v;
  }

  get t(): VertexSet {
    return this.vertices[1];
  }

  set t(v: VertexSet) {
    this.vertices[1] = v;
  }

  public override get size(): number {
    return this.vertices[0].length + this.vertices[1].length;
  }

  // Q: Should we write a functor going to mutitple directed edges?
  // Q: Should we write a functor going to undirected hyperedges?
}
