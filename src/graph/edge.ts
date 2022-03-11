import { IVertex } from './vertex';

/**
 * Edges and Arcs have only pair of vertices per edge.
 */
export type VertexPair = [IVertex, IVertex];

/**
 * Hypergraphs can have up to two vertex sets per edge.
 */
export type VertexSet = IVertex[];

/**
 * Internally, we represent everything as a set of sets, which allows a simple
 * map from graph to hypergraph.
 */
 export type VertexSetSet = VertexSet[];

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
export class UndirectedEdge extends Edge {
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
 *   Has morphisms h and t mapping to vertex elements.
 */
export class DirectedEdge extends Edge {
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
  public toUndirected(): UndirectedEdge {
    return new UndirectedEdge([this.h, this.t]);
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
