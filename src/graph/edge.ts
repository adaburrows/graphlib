import { IVertex, VertexPair, VertexSet, VertexSetSet } from './vertex';


/**
 * Interface for edges.
 */
export interface IEdge {
  vertices: VertexSetSet;
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
  public vertices: VertexSetSet;
  constructor() {
    this.vertices = new Array<VertexSet>(2);
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
   * Is the edge a loop?
   * This assumes no key collisions across the whole dataset.
   * TODO:
   * Theoretically, this could be represented the same way as it is in the
   * UndirectedHyperedge. When there is a loop, we could automatically reduce it
   * to not have a `y` element. The question is should we? It may be more logic
   * and, technically, it would use the same amount of memory without doing crazy
   * things in an ArrayBuffer.
   */
  override get isLoop(): boolean {
    return this.x.key == this.y.key;
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
   * Is the edge a loop?
   * This assumes no key collisions across the whole dataset.
   */
   override get isLoop(): boolean {
    return this.h.key == this.t.key;
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
  public toUndirectedEdge(): UndirectedEdge {
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

  /**
   * Is the edge a loop?
   * This assumes no key collisions across the whole dataset.
   * TODO:
   * When we implement duplicate checking for vertices in edges, this will just
   * need to compare `this.size) instead of `nonRepeats`.
   */
  override get isLoop(): boolean {
    const nonRepeats = this.vertices[0].reduce<VertexSet>((accum: VertexSet, vertex: IVertex): VertexSet => {
      if(accum.length) {
        if(accum[0].key != vertex.key) {
          accum.push(vertex);
        }
      } else {
        accum.push(vertex)
      }
      return accum;
    }, new Array<IVertex>());
    return nonRepeats.length == 1;
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
    return this.size == 2 && this.h[0].key == this.t[0].key;
  }

  // Q: Should we write a functor going to mutitple directed edges?
  // Q: Should we write a functor going to undirected hyperedges?
}
