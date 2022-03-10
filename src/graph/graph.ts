import { IVertex } from './vertex';
import { Edge, Undirected, Directed, /* Hyperedge, DirectedHyperedge */ } from './edge';

/*

There are several rules that can be applied to constructing graphs.

For those needing a refresher:
* {} is an unordered set
* () is an orderd set (tuple)
* Any captial letter refers to one of the above.
* A lower case letter refers to an element of one of the above.

So we can define the folowing:
* Allow only one edge between vertices
  * Undirected simple graph - graph
    * G = (V, E)
    * E ⊆ {{x, y} | x, y ∈ V and x ≠ y}
  * Oriented digraph
    * G = (V, A)
    * A ⊆ {(x, y) | (x, y) ∈ V² and x ≠ y}
    * only (x, y) and not (y, x)
    * Really, this is a projection of a simple graph onto a digraph with a choice
      of the direction.
* Allow up to two directed edges pointing in opposite directions between
  vertices
  * Directed simple graph - digraph
    * G = (V, A)
    * A ⊆ {(x, y) | (x, y) ∈ V² and x ≠ y}
* Allow multiple edges between vertices
  * Undirected multigraph - multigraph
    * G = (V, E, φ)
    * φ: E → {{x, y} | x, y ∈ V and x ≠ y}
  * Directed multigraph - multidigraph
    * G = (V, A, φ)
    * φ: A → {(x, y) | (x, y) ∈ V² and x ≠ y}
* Allow multiple types of edges in the same graph
  * Allow one undirected edge and up to two opposite pointing directed edges
    * Mixed simple graph
      * G = (V, E, A)
      * E ⊆ {{x, y} | x, y ∈ V and x ≠ y}
      * A ⊆ {(x, y) | (x, y) ∈ V² and x ≠ y}
  * Allow any number of any type of edge
    * Mixed multigraph
      * G = (V, E, A, φ_E, φ_A)
      * φ_E: E → {{x, y} | x, y ∈ V and x ≠ y}
      * φ_A: A → {(x, y) | (x, y) ∈ V² and x ≠ y}
* Allow additional structure, like labels, weights, etc
  * G_S = G × (S_E, η_ES) × (S_A, η_AS)
  * η_ES: E → S_E
  * η_AS: A → S_A
  * where:
    * S is the set of additional structures
    * Arrows (η_ES, η_AS) map E and A onto their respective S
* Labeled
  * G_S = G × (Σ_E, η_ES) × (Σ_A, η_AS)
  * η_ES: E → Σ_E
  * η_AS: A → Σ_A
  * where:
    * Σ is the alphabet of labels
    * Arrows (η_ES, η_AS) map E and A onto their respective Σ
* Rooted
  * G_R = G × (R)
  * R ⊂ V
  * Basically, there is an additional subset of vertices which belong to the
    set of roots that only contains a portion of the set of vertices.
* Allow loops (self-edges)
  * Remove constraint {x ≠ y} to allow {x = y}
  * A Quiver is a multidigraph with loops
* Hypergraphs?
  * Why not? We have to pass the graph the specific set of edges to use anyway.
  * In an undirected graph, an edge only connects two vertices.
    * In a hypergraph, it connects a set of vertices.
  * In a directed graph, an an edge connects a head vertex to a tail vertex.
    * In a hyp., it connects a set of head vertices to a set of tail vertices.
  * All we need is to pass in a specific Edge set typed to match a hyperedge.

It turns out we can simply compose modules that each implement the above
functionality.
*/

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

    public undirected: Undirected[];

    constructor(...args: any[]) {
      super(...args);
      this.undirected = new Array<Undirected>();
    }

    /**
     * Add an edge to the graph.
     */
    public add_undirected(edge: Undirected): this {
      this.undirected.push(edge);
      return this;
    }

    /**
     * Add Undirected edges to the graph.
     */
     public add_undirecteds(edges: Undirected[]) {
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

    public directed: Directed[];

    constructor(...args: any[]) {
      super(...args);
      this.directed = new Array<Directed>();
    }

    /**
     * Add an edge to the graph.
     */
    public add_directed(edge: Directed): this {
      this.directed.push(edge);
      return this;
    }

    /**
     * Add Undirected edges to the graph.
     */
     public add_directeds(edges: Directed[]) {
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
