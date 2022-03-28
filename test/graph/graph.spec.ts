import { Graph, Vertex, Edge, UndirectedEdge, DirectedEdge, UndirectedHyperedge, DirectedHyperedge, NoLoops, Rooted } from "../../src";

/**
 * Example custom vertex type used for testing
 */
class Datum extends Vertex {
  public id: number;
  public name: string;
  public notes: string;

  constructor(id: number, name: string, notes: string) {
    super();
    this.id = id;
    this.name = name;
    this.notes = notes;
  }

  public get key(): number {
    return this.id;
  }
}

/**
 * Dataset using custom vertex type
 */
const data: Datum[] = [
  new Datum(1, "Xochitl", "Name means flower."),
  new Datum(2, "Cuetzpalin", "Name means lizard or iguana."),
  new Datum(3, "Cuauhtli", "Name means Eagle"),
  new Datum(4, "Itzcuintli", "A child's name meaning dog; my mom uses it to refer to small children")
];

describe('The Graph Object', () => {
  test('should allow custom vertex types', () => {
    const graph = new Graph<Datum, Edge>();
    graph.addVertices(data);
    expect(graph.order).toEqual(4);
  });

  test('should allow undirected edges', () => {
    const graph = new Graph<Datum, Edge>();
    graph.addVertices(data);
    const edge = new UndirectedEdge([data[1].key, data[2].key]);
    graph.addEdge(edge);
    expect(graph.size).toEqual(1);
  });

  test('should allow directed edges', () => {
    const graph = new Graph<Datum, Edge>();
    graph.addVertices(data);
    const edge = new DirectedEdge([data[1].key, data[2].key]);
    graph.addEdge(edge);
    expect(graph.size).toEqual(1);
  });

  test('should allow undirected hyperedges', () => {
    const graph = new Graph<Datum, Edge>();
    graph.addVertices(data);
    const edge = new UndirectedHyperedge([data[1].key, data[2].key]);
    graph.addEdge(edge);
    expect(graph.size).toEqual(1);
  });

  test('should allow directed hyperedges', () => {
    const graph = new Graph<Datum, Edge>();
    graph.addVertices(data);
    const edge = new DirectedHyperedge([data[1].key], [data[2].key]);
    graph.addEdge(edge);
    expect(graph.size).toEqual(1);
  });

  test('should allow all kinds of edges to coexist between the same two vertices', () => {
    // Setup graph and add data
    const graph = new Graph<Datum, Edge>();
    graph.addVertices(data);

    // Add edges
    const undirectedEdge = new UndirectedEdge([data[1].key, data[2].key]);
    graph.addEdge(undirectedEdge);
    const directedEdge = new DirectedEdge([data[1].key, data[2].key]);
    graph.addEdge(directedEdge);
    const undirectedHyperedge = new UndirectedHyperedge([data[1].key, data[2].key]);
    graph.addEdge(undirectedHyperedge);
    const directedHyperedge = new DirectedHyperedge([data[1].key], [data[2].key]);
    graph.addEdge(directedHyperedge);

    expect(graph.size).toEqual(4);
    expect(graph.sizeUndirectedEdge).toEqual(1);
    expect(graph.sizeDirectedEdge).toEqual(1);
    expect(graph.sizeUndirectedHyperedge).toEqual(1);
    expect(graph.sizeDirectedHyperedge).toEqual(1);
  });

  test('should determine if it does or does not have a node added already', () => {
    // Setup graph and add data
    const graph = new Graph<Datum, Edge>();
    graph.addVertices(data);
    const node = new Datum(5, "Tlalli", "Means land");

    expect(graph.hasVertex(data[0])).toEqual(true);
    expect(graph.hasVertex(node)).toEqual(false);
  });

  test('should determine by key if it does or does not have a node added already', () => {
    // Setup graph and add data
    const graph = new Graph<Datum, Edge>();
    graph.addVertices(data);
    const node = new Datum(5, "Tlalli", "Means land");

    expect(graph.hasVertex(1)).toEqual(true);
    expect(graph.hasVertex(node.key)).toEqual(false);
  });

  test('should retreive a node by key', () => {
    // Setup graph and add data
    const graph = new Graph<Datum, Edge>();
    graph.addVertices(data);

    expect(graph.getVertex(1)).toEqual(data[0]);
    expect(graph.getVertex(6)).toBeUndefined();
  });
});

describe('A graph using NoLoops', () => {
  test('should not allow a loop', () => {
    /**
     * This is an example of how to use the NoLoops mixin.
     * 
     * For some reason we cannot do this:
     *   `const SimpleGraphNoLoops = NoLoops(Graph<Datum, UndirectedEdge>);`
     * 
     * So this is the workaround:
     */
    class SimpleGraph extends Graph<Datum, UndirectedEdge> {}
    const SimpleGraphNoLoops = NoLoops(SimpleGraph);

    // Setup graph and add data
    const graph = new SimpleGraphNoLoops();
    graph.addVertices(data);
    const undirectedEdge = new UndirectedEdge([data[1].key, data[1].key]);
    expect(() => {
      graph.addEdge(undirectedEdge);
    }).toThrow("A loop was detected in the data and the current graph disallows loops.");
  });
});

describe('A graph using Rooted', () => {
  test('should allow adding a root', () => {
    class Digraph extends Graph<Datum, DirectedEdge> {}
    const DigraphNoLoops = NoLoops(Digraph);
    const AlmostTree = Rooted(DigraphNoLoops);
    const arbol = new AlmostTree();

    // Setup graph and add data
    arbol.addVertices(data);
    arbol.addRoot(data[0]);
    expect(arbol.getRoots()[0]).toEqual(data[0]);
  });
});
