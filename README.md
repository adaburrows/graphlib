# Graphlib

A typed graph library taking inspiration from category theory. This is very much
a work in progress.

## Summary of Graph Principles

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

### The Adjacency Matrix + Linear Algebra

The other represenation of a graph is as a matrix. There is actually more than
one matrix representation, but the adjacency matrix is the most common. The
adjacency matrix representation begins by assigning an index to each node in the
graph. If there are N nodes in the graph, the index will run from 0 to (N-1).
The N x N matrix then contains a 1 as the element e_{ij} whenever node i connects
to node j.

For example, imagine we have a graph with three nodes. Lets see the
undirected version of the matrix where they are all connected in a triangle:

![](https://latex.codecogs.com/png.image?%5Cbegin%7Bbmatrix%7D0%20&%201%20&%201%20%5C%5C1%20&%200%20&%201%20%5C%5C1%20&%201%20&%200%20%5C%5C%5Cend%7Bbmatrix%7D)

If there was an undirected loop on node 1, then e_{00}, would be a two:

![](https://latex.codecogs.com/png.image?%5Cbegin%7Bbmatrix%7D2%20&%201%20&%201%20%5C%5C1%20&%200%20&%201%20%5C%5C1%20&%201%20&%200%20%5C%5C%5Cend%7Bbmatrix%7D)

Here is the directed graph where node 1 points to node 2, node 2 points to node 3, and node 3 points to node 1:

![](https://latex.codecogs.com/png.image?%5Cbegin%7Bbmatrix%7D0%20&%200%20&%201%20%5C%5C1%20&%200%20&%200%20%5C%5C0%20&%201%20&%200%20%5C%5C%5Cend%7Bbmatrix%7D)

If there was a directed loop on node 1, then e_{00} would be one:

![](https://latex.codecogs.com/png.image?%5Cbegin%7Bbmatrix%7D1%20&%200%20&%201%20%5C%5C1%20&%200%20&%200%20%5C%5C0%20&%201%20&%200%20%5C%5C%5Cend%7Bbmatrix%7D)

Since multigraphs, can multiple edges between two points, the entry in the
adjacency matrix will be multiplied by the number of times that path occurs. Also,
If a graph mixes both directed and undirected edges, it won't be symmetric and
certain entries will be the some of the directed edge plus the undirected edge.

E.g., In the original undirected graph, we can add two directed edges, from node
2 to node 1 and from node 3 to node 1. The resulting adjacency matrix will be:

![](https://latex.codecogs.com/png.image?%5Cbegin%7Bbmatrix%7D0%20&%202%20&%202%20%5C%5C1%20&%200%20&%201%20%5C%5C1%20&%201%20&%200%20%5C%5C%5Cend%7Bbmatrix%7D)

What's intriguing about a matrix representation of a graph is that it allows
traversing the graph and studying the graph through linear algebra. More of this
will be demonstrated in the examples. 

### Set Theory Overview

If you would like to read a highly condensed set theory overview of graphs, see [Set Theory Overview](docs/set_theory_overview.md).

### Reading

There is [a long list of reading material around graphs and graph algorithms here](docs/reading.md).