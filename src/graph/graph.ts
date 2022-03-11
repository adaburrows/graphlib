import { IVertex } from './vertex';
import { Edge, UndirectedEdge, DirectedEdge, /* Hyperedge, DirectedHyperedge */ } from './edge';

/**
 * Base class for all graphs. Everything besides a hypergraph is just
 * additional restrictions placed on the main graph. What is interesting is
 * that our base class is just a placeholder for the sets described above.
 * We just it with mixins to acheive the functionality we want.
 */
export class GraphBase {
  /**
   * Returns the count of the vertices.
   * Used to determine size of the adjacency matrix.
   */
  public get order(): number {
    return 0;
  }

  public get sizeUndirected(): number {
    return 0;
  }

  public get sizeDirected(): number {
    return 0;
  }

  public get sizeUndirectedHyperedge(): number {
    return 0;
  }

  public get sizeDirectedHyperedge(): number {
    return 0;
  }

  /**
   * Returns the size of the graph.
   * 
   * This is the number of edges.
   */
  public get size(): number {
    return this.sizeUndirected + this.sizeDirected +
      this.sizeUndirectedHyperedge + this.sizeDirectedHyperedge;
  }

}

type Constructor<T> = new(...args: any[]) => T;
type GraphT = Constructor<GraphBase>;

/**
 * Add Vertices to the graph
 */
export const Vertices = <T extends GraphT>(Base: T): T =>
  class Vertices extends Base {
    public vertices: IVertex[];

    constructor(...args: any[]) {
      super(...args);
      this.vertices = new Array<IVertex>();
    }
  
    /**
     * Add a vertex to the graph.
     */
    public add_vertex(vertex: IVertex): this {
      // Uses valueOf to do comparisons at the key level
      if (this.vertices.indexOf(vertex) === -1) {
        this.vertices.push(vertex);
      }
      return this;
    }
  
    /**
     * Returns the count of the vertices.
     * Used to determine size of the adjacency matrix.
     */
    public override get order(): number {
      return this.vertices.length;
    }
  
  };

/**
 * Add undirected edges to the graph
 */
export const UndirectedEdges = <T extends GraphT>(Base: T): T =>
  class UndirectedEdges extends Base {

    public undirected: UndirectedEdge[];

    constructor(...args: any[]) {
      super(...args);
      this.undirected = new Array<UndirectedEdge>();
    }

    /**
     * Add an edge to the graph.
     */
    public add_undirected(edge: UndirectedEdge): this {
      this.undirected.push(edge);
      return this;
    }

    /**
     * Add Undirected edges to the graph.
     */
     public add_undirecteds(edges: UndirectedEdge[]) {
      for (const edge of edges) {
        this.add_undirected(edge);
      }
    }

    /**
     * Do we have undirected edges?
     */
    public get hasUndirected(): boolean {
      return this.undirected.length > 0;
    }

  };

/**
 * Add directed edges
 */
export const DirectedEdges = <T extends GraphT>(Base: T): T =>
  class DirectedEdges extends Base {

    public directed: DirectedEdge[];

    constructor(...args: any[]) {
      super(...args);
      this.directed = new Array<DirectedEdge>();
    }

    /**
     * Add an edge to the graph.
     */
    public add_directed(edge: DirectedEdge): this {
      this.directed.push(edge);
      return this;
    }

    /**
     * Add Undirected edges to the graph.
     */
     public add_directeds(edges: DirectedEdge[]) {
      for (const edge of edges) {
        this.add_directed(edge);
      }
    }

    /**
     * Do we have undirected edges?
     */
    public get hasDirected(): boolean {
      return this.directed.length > 0;
    }

  };

/**
 * Disallow loops
 */
export const WithoutLoops = <T extends GraphT>(Base: T): T =>
  class WithoutLoops extends Base {

    // This should wrap the add_* methods
    public loopRule(edge: Edge): boolean {
      return (edge.vertices[0] != edge.vertices[1]);
    }
  };

/**
 * Creates a rooted graph
 */
export const Rooted = <T extends GraphT>(Base: T): T =>
  class Rooted extends Base {
    public roots: IVertex[];

    constructor(...args: any[]) {
      super(...args);
      this.roots = new Array<IVertex>();
    }

    public add_root(root: IVertex) {
      this.roots.push(root);
    }
  };
