import {VertexKeyType, VKSetSet, VKSet, VKPair } from './vertex';

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

  public override get size(): number {
    return this.vertices[0].length + this.vertices[1].length;
  }

  /**
   * Is the edge a loop?
   * This assumes no key collisions across the whole dataset.
   * TODO:
   * Is a directed hyperedge with size being 2n that loops back to the same set
   * of n vertices a loop? Probably. We need to have a more robust way
   * of checking that the two sets have vertices with the same keys no matter
   * which order they are in.
   */
   override get isLoop(): boolean {
    return this.size == 2 && this.h[0] == this.t[0];
  }

  // Q: Should we write a functor going to mutitple directed edges?
  // Q: Should we write a functor going to undirected hyperedges?
}
