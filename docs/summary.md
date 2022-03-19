# Summary of Graph Principles

Typically, graphs are simply defined as vertices connected by edges. Slight more
formally, graphs are a set of vertices and a set of edges that connect two or
more vertices. Sometimes edges are called "arcs" or "arrows". Here I try to use
"edges". Edges can be undirected (a reciprical relationship) or directed. In the
directed case, there there is a head and a tail (sometimes called start and end).
There are several rules that can be applied to constructing graphs. Here, I'll go
over the way I've been thinking about graphs. The mathematical rules of how
graphs are typically constructed are laid out in a later section.

If we reduce the graph to primitives, we can see a graph is really just a set of
sets of sets. Edges can be looked at like they are a set of sets. The graph
itself has a set of those sets. This implementation allows us to see that the
underlying type is the same across all edges:

* A simple edge is a set two sets, one with two elements while the other sits
  empty.
* A directed edge is a set of two sets with one element each, the head and the
  tail.
* A hyperedge has a set of two sets, one with as no restriction on elements
  while the other sits empty.
* A directed hyperedge has a set of two sets (head and tail sets), with no
  restriction on size for either set.

Of course, the other way of looking at it is that undirected edges have a set of
one set, while directed edges have a set of two sets, one set being the head, 
the other set being the tail.

We can see that each type of graph is really just a more restricted form of
a general hypergraph (which allows all types of edges to coexist in any number):

* Regular multigraphs being 2-uniform hypergraphs (each edge of size 2).
  * Edges must be size two.
* Regular graphs being being 2-uniform hypergraphs.
  * Edges must be size two.
  * Only undirected edges.
* Directed graphs (digraphs) being 2-uniform directed hypergraphs.
  * Edges must be size two.
  * Only directed edges.
* Oriented digraphs being 2-uniform directed hypergraphs.
  * Edges must be size two.
  * Only directed edges.
  * Every edge must point the same direction.
  * Only one edge per unique pair of vertices.

Additionally, we can define other restrictions, such as not allowing loops. Or,
perhaps, other maps which define certain vertices as "roots".

### Set Theory Overview

If you would like to read a highly condensed set theory overview of graphs, see [Set Theory Overview](docs/set_theory_overview.md).