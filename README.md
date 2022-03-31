# Graphlib

A typed graph library taking inspiration from category theory. This is very much
a work in progress, but has some basic capabilities already.

For a basic summary of how this library conceptualizes graphs, [please read the summary](docs/summary.md).

## Usage

To set up your project with this development branch, use `pnpm` in your project's root:

```
pnpm add github:adaburrows/graphlib
```

Once that's out of the way, you can begin using the library. Here's how to
construct an undirected multigraph that uses nodes that only allow keys as
their values and `UndirectedEdge`s:

```
import {Graph, KeyVertex, UndirectedEdge} from 'graphlib';

const graph = new Graph<KeyVertex, UndirectedEdge>();
const vertices = [
  new KeyVertex(0),
  new KeyVertex(1),
  new KeyVertex(2)
];
const edges = [
  new UndirectedEdge(0, 1),
  new UndirectedEdge(1, 2),
  new UndirectedEdge(2, 0)
];
graph.addVertices(vertices);
graph.addEdges(edges);
```

Vertex keys can be any combination of `number | string | symbol`. Theoretically,
they could be any object since it's backed by a `Map()`. If the feature is
requested, it can be added.

### The Graph

The graph allows us to specify the types of vertices and edges allow within the
graph:

```
Graph<VertexType extends Vertex, EdgeType extends Edge>
```

This means that any kind of graph can be constructed by restricting the graph
types:

```
import {Graph, KeyVertex, Edge, UndirectedEdge, DirectedEdge, Hyperedge, UndirectedHyperedge, DirectedHyperedge} from 'graphlib';

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
const uhypergraph = new Graph<KeyVertex, UndirectedHyperedge>();

// Directed hypergraph, any number of directed hyperedges
const dhypergraph = new Graph<KeyVertex, DirectedHyperedge>();
```

#### Graph Mixins

There are certain mixins which can modify the behavior of the graph. If one isn't
familiar with the pattern of Typescript mixins, it may seem awkward. With some
practice, it can be quite natural to work with mixins. In some cases, it will
prove more problematic to use a mixin compared to deriving a new child class. 

##### NoLoops

Restricts a graph from having any loops:

```
class SimpleGraph extends Graph<Datum, UndirectedEdge> {}
const SimpleGraphNoLoops = NoLoops(SimpleGraph);
const graph = new SimpleGraphNoLoops();
```

##### Rooted

Adds a set of roots to a graph and an interface to add roots and retrieve them.
Here is an example of something that could model a tree (no acyclic guarantees):

```
class Digraph extends Graph<Datum, DirectedEdge> {}
const DigraphNoLoops = NoLoops(Digraph);
const AlmostTree = Rooted(DigraphNoLoops);
const arbol = new AlmostTree();
```

##### Possibilities

Since mixins allow changing behaviors of clases with predefined interfaces, they
can be used to constrain the number of edges added between each node. They can
also check to see if there are any cycles generated by adding a edge (though it
may be computationally intensive to ensure that condition). They can also be used
to make sure certain kinds of edges only connect to certain kinds of vertices.
The possibilities are nearly endless. But bare in mind, in some cases, it may be
best to just derive a new child class.

### Interfaces

The library has some basic interfaces that all the parts of the graph use:

* `IVertex` &mdash; Requires a unique key property that must be a `VertexKeyType`
(one of `number | string | symbol`).
* `IEdge` &mdash; Requires a set of sets of vertices (a `VertexSetSet`) and an
`isLoop` accessor that determines if the edge is a loop (not to be confused with
a similar term called a cycle).

### Vertices

All vertices derive from the `Vertex` class. The idea is that most vertex types
will be application specific. The basic vertex classes already implemented are:

* `DataVertex<T>` &mdash; A basic vertex that allows any kind of data to be stored
as long as a corresponding `key_accessor` is provided.
  * `KeyVertex<VertexKeyType>` &mdash; An exmple vertex that only stores the key.
  The `key_accessor` is just the identity function.

Here is a simple example vertex class used in the tests:

```
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
Of course, any other kind of edge can be derived from these basic classes. Here
are a few examples:

#### Labled Edges

To create a labeled edge, simply derive a child class that has a label:

```
export class LabeledArrow extends DirectedEdge {
  public label: string;

  constructor(label: string, t:VertexKeyType, h: VertexKeyType) {
    super(t, h);
    this.label = label;
  }
}

const aSaysHelloToB = new LabeledArrow('Hello', 'a', 'b');
```

While it would be possible to create a mixin, the mixin wouldn't be able to change
the constructor signature, but it would be nearly as simple:

```
type EdgeConstructor = new (...args: any[]) => Edge;

function Labeled<T extends EdgeConstructor>(Base: T) {
  return class Labeled extends Base {
    public label: string | null = null;
  }
}

const ArrowWithLabel = Labeled(DirectedEdge);

const edge = new ArrowWithLabel('a', 'b');
edge.label = 'Hello';
```

#### Weighted Edges

To create a weighted edge, simply derive a child class that has a weight:

```
export class WeightedArc extends DirectedEdge {
  public weight: number;

  constructor(weight: string, t:VertexKeyType, h: VertexKeyType) {
    super(t, h);
    this.weight = weight;
  }
}

const edgeWithWeight = new WeightedArc(7, 'a', 'b');
```

## Reading

To [understand more about why the data structures are the way the are, there's the summary](docs/summary.md).

There is [a long list of reading material around graphs and graph algorithms here](docs/reading.md).