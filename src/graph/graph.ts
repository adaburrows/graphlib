import { Vertex, VertexKeyType, VertexSet } from './vertex';
import { Edge, UndirectedEdge, DirectedEdge, UndirectedHyperedge, DirectedHyperedge } from './edge';

/**
 * Generalized graph template.
 * This can be a generalized hypergraph, a multigraph, a digraph, or any type of
 * graph based on the type parameters and additional restraints placed on the
 * edges.
 */
export class Graph<VertexType extends Vertex, EdgeType extends Edge> {
  public vertices: Map<VertexKeyType, VertexType>;
  public edges: EdgeType[];

  constructor() {
    this.vertices = new Map<VertexKeyType, VertexType>();
    this.edges = new Array<EdgeType>();
  }

  /**
   * Add a vertex to the graph. Assumes that all keys must be unique.
   * @param vertex 
   * @returns
   */
  public addVertex(vertex: VertexType): this {
    // Uses valueOf to do comparisons at the key level
    if (!this.vertices.has(vertex.key)) {
      this.vertices.set(vertex.key, vertex);
    }
    return this;
  }

  /**
   * Check to see if a graph has a particular vertex
   * @param vertex
   * @returns
   */
  public hasVertex(vertex: Vertex | VertexKeyType): boolean {
    if (vertex instanceof Vertex) {
      return this.vertices.has(vertex.key);
    } else {
      return this.vertices.has(vertex as VertexKeyType);
    }
  }

  /**
   * Get a particular node by key
   * @param vertexKey
   * @returns
   */
  public getVertex(vertexKey: VertexKeyType): Vertex | undefined {
    return this.vertices.get(vertexKey);
  }

  /**
   * Deletes a particular vertex
   * @param vertex
   * @returns
   */
  public dropVertex(vertex: Vertex | VertexKeyType): boolean {
    if (vertex instanceof Vertex) {
      return this.vertices.delete(vertex.key);
    } else {
      return this.vertices.delete(vertex as VertexKeyType);
    }
  }

  /**
   * Add vertices to the graph.
   * @param vertices 
   * @returns
   */
  public addVertices(vertices: VertexType[]): this {
    vertices.forEach((v) => {
      this.addVertex(v)
    });
    return this;
  }
  
  /**
   * Returns the count of the vertices.
   * Used to determine size of the adjacency matrix.
   */
   public get order(): number {
    return this.vertices.size;
  }

  /**
   * Returns the edges that refer to vertex.
   * @param vertex
   * @returns
   */
  public getVertexEdges(vertex: Vertex | VertexKeyType): EdgeType[] {
    const key = vertex instanceof Vertex? vertex.key : vertex;
    let edges = new Array<EdgeType>();
    for (let edge of this.edges) {
      if (edge.vertices.S.includes(key)) {
        edges.push(edge);
      }
    }
    return edges;
  }

  /**
   * Add an edge
   * TODO: Need to add identity checks on the edges
   * TODO: Need to understand the idea of edge identity in the case of a
   * multigraph with multiple edges between the same two vertices.
   */
  public addEdge(edge: EdgeType): this {
    this.edges.push(edge);
    return this;
  }

  /**
   * Add edges
   */
  public addEdges(edges: EdgeType[]): this {
    edges.forEach((e) => {
      this.addEdge(e)
    });
    return this;
  }

  /**
   * Returns the size of the graph (number of edges).
   */
  public get size(): number {
    return this.edges.length;
  }

  public get sizeUndirectedEdge(): number {
    return this.edges.filter((edge) => edge instanceof UndirectedEdge).length;
  }

  public get sizeDirectedEdge(): number {
    return this.edges.filter((edge) => edge instanceof DirectedEdge).length;
  }

  public get sizeUndirectedHyperedge(): number {
    return this.edges.filter((edge) => edge instanceof UndirectedHyperedge).length;
  }

  public get sizeDirectedHyperedge(): number {
    return this.edges.filter((edge) => edge instanceof DirectedHyperedge).length;
  }

}

/**
 * Constructor type used for the mix-in pattern
 */
type GraphConstructor = new (...args: any[]) => Graph<Vertex, Edge>;

/**
 * Mix-in to disallow loops
 */
export function NoLoops<T extends GraphConstructor>(Base: T) {
  return class NoLoops extends Base {

    public override addEdge(edge: Edge): this {
      if (!edge.isLoop) {
        super.addEdge(edge);
      } else {
        throw Error("A loop was detected in the data and the current graph disallows loops.");
      }
      return this;
    }
  }
}

/**
 * Mix-in for a rooted graph
 * TODO:
 * Perhaps this should be a child of Graph instead of a mix-in, because this
 * doesn't have the same type-safety around VertexType.
 */
export function Rooted<T extends GraphConstructor>(Base: T) {
  return class Rooted extends Base {
    public roots: VertexSet;

    constructor(...args: any[]) {
      super(...args);
      this.roots = new Array<Vertex>();
    }

    public addRoot(root: Vertex) {
      this.roots.push(root);
    }

    public getRoots(): VertexSet {
      return this.roots;
    }
  }
}
