# Graphlib

A typed graph library taking inspiration from category theory. This is very much
a work in progress, but has some basic capabilities already.

For a basic summary of how this library conceptualizes graphs, [please read the summary](docs/summary.md).

## Usage

The most basic usage of the graph library is to construct an undirected
multigraph (note the edge type restriction):

```
const graph = new Graph<KeyVertex, UndirectedEdge>();
const vertices = [
  new KeyVertex(0),
  new KeyVertex(1),
  new KeyVertex(2)
];
const edges = [
  new UndirectedEdge(nodes[0], nodes[1]),
  new UndirectedEdge(nodes[1], nodes[2]),
  new UndirectedEdge(nodes[2], nodes[0])
];
graph.addVertices(vertices);
graoh.addEdges(edges);
```

### Interfaces

The library has some basic interfaces that all the parts of the graph use:

* `IVertex` &mdash; Requires a unique key property that must be a `VertexKeyType`
(one of `number | string | symbol`).
* `IEdge` &mdash; Requires a set of sets of vertices (a `VertexSetSet`) and an
`isLoop` accessor that determines if the edge is a loop (not to be confused with
a similar term called a cycle).

### Vertices

There is currently no base class that all vertices derrive from. The idea is that
most vertex types will be application specific. The only restriction is that it
must implement `IVertex`.

* `DataVertex<T>` &mdash; A basic vertex that allows any kind of data to be stored
as long as a corresponding `key_accessor` is provided.
  * `KeyVertex<VertexKeyType>` &mdash; An exmple vertex that only stores the key.
  The `key_accessor` is just the identity function.

Here is an example vertex class used in the tests:

```
class Datum implements IVertex {
  public id: number;
  public name: string;
  public notes: string;

  constructor(id: number, name: string, notes: string) {
    this.id = id;
    this.name = name;
    this.notes = notes;
  }

  public get key(): number {
    return this.id;
  }
}
```

### Edges

The edges form a hierarchy of:

* `Edge`
  * `UndirectedEdge`
  * `DirectedEdge`
  * `Hyperedge`
    * `UndirectedHyperedge`
    * `DirectedHyperedge`

This hierarchy can be used to limit what kinds of edges can be added to a graph.

#### Labled Edges

To create a labeled edge, it simply derive a child class that has a label:

```
export class LabeledArrow extends DirectedEdge {
  public label: string;

  constructor(label: string, ...vertex_pair:VertexPair) {
    super(vertex_pair);
    this.label = label;
  }
}
```

While it would be possible to create a mixin, the mixin wouldn't be able to change
the constructor signature. 

### Mixins

There are certain mixins which can modify the behavior of the graph. Using the
mixins can be slightly awkward, but it makes sense.

#### NoLoops

Restricts a graph from having any loops:

```
class SimpleGraph extends Graph<Datum, UndirectedEdge> {}
const SimpleGraphNoLoops = NoLoops(SimpleGraph);
const graph = new SimpleGraphNoLoops();
```

#### Rooted

Adds a set of roots to a graph and an interface to add roots and retrieve them:

```
class Digraph extends Graph<Datum, DirectedEdge> {}
const DigraphNoLoops = NoLoops(Digraph);
const Tree = Rooted(DigraphNoLoops);
const arbol = new Tree();
```

### The Graph

The graph allows us to specify the types of vertices and edges allow within the
graph:

```
Graph<VertexType extends IVertex, EdgeType extends Edge>
```

This means that any kind of graph can be constructed by restricting the graph
types:

```
// Anything goes generalized graph, can have any number of any type of edge
const general_graph = new Graph<KeyVertex, Edge>();

// Multigraph, can have any number of undirected or directed edges
const multigraph = new Graph<KeyVertex, UndirectedEdge | DirectedEdge>();

// Digraph
const digraph = new Graph<KeyVertex, DirectedEdge>();

// Graph
const graph = new Graph<KeyVertex, UndirectedEdge>();

// Hypergraph
const hypergraph = new Graph<KeyVertex, Hyperedge>();

// Undirected hypergraph, any number of undirected hyperedges
const uhypergraph = new Graph<KeyVertex, UndirectedEdge>();

// Directed hypergraph, any number of directed hyperedges
const dhypergraph = new Graph<KeyVertex, DirectedEdge>();
```

## Reading

There is [a long list of reading material around graphs and graph algorithms here](docs/reading.md).