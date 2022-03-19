import { IVertex, VertexSet } from './vertex';
import { Edge, UndirectedEdge, DirectedEdge, UndirectedHyperedge, DirectedHyperedge } from './edge';

/**
 * Generalized graph template.
 * This can be a generalized hypergraph, a multigraph, a digraph, or any type of
 * graph based on the type parameters and additional restraints placed on the
 * edges.
 */
export class Graph<VertexType extends IVertex, EdgeType extends Edge> {
  public vertices: VertexType[];
  public edges: EdgeType[];

  constructor() {
    this.vertices = new Array<VertexType>();
    this.edges = new Array<EdgeType>();
  }

  /**
   * Add a vertex to the graph.
   * @param vertex 
   * @returns
   */
  public addVertex(vertex: VertexType): this {
    // Uses valueOf to do comparisons at the key level
    if (this.vertices.indexOf(vertex) === -1) {
      this.vertices.push(vertex);
    }
    return this;
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
    return this.vertices.length;
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
type GraphConstructor = new (...args: any[]) => Graph<IVertex, Edge>;

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
      this.roots = new Array<IVertex>();
    }

    public addRoot(root: IVertex) {
      this.roots.push(root);
    }

    public getRoots(): VertexSet {
      return this.roots;
    }
  }
}
