# Summary of Graph Principles

## Graphs

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

## Discussion on edges

It might make more sense to approach the edges like I approach the graph, where
there are certain restrictions placed on the graph from most general to most
specific. When I first wrote this code in 2021, I was wrestling with how to
represent the differences between the directed and undirected types. I went
through the math looking for patterns and generalizations and came away thinking
it was too murky. So I implemented the code as it is now (before commit 3d9ae8a).

One of the ways of looking at the edges is that Undirected and Directed are
fundamentally different types, but Hyperedges and Edges are not. This can be seen
below by noticing how the undirected edges never use the second array of the
VKSetSet. Also, it can be seen that any edge is really just a hyperedge
restrained to size 2. If it's undirected, then there are two entries in the first
element of the VKSetSet, while if it's directed, then there is one entry each in
the two elements of the VKSetSet.

Also, while looking at this, I noticed that there's a generalization of the
pattern around edges:
* Undirected edges are of the type [[]]
* Directed edges are of the type [[],[]]
* There is obviously a generalization into [[],[],[]], [[],[],[],[]], etc.
It turns out after reading through more literature, that I've stumbled across
simplical sets, but that I wasn't applying them 100% correctly. I'm still using
the concept of the simplex for my types of edges.

When I first thought about these objects I got confused, because I ended up not
being able to separate the concept of a path along the sets I was defining and
the concept of the simplical set. They both have similar structures, since a path
defines connections between vertices in a specific order and a simplex does the
same sort of thing. However, they are different in conceptualization.

A simplex can intuitively be thought of like so:
* vertex = 0-simplex [['a']]
* edge = 1-simplex [['a'], ['b']]
* triangle = 2-simplex [['a'],'['b'], ['c']]
* etc.

This may seem at odds with my above definition of an undirected versus directed
edge definition above. However, I don't think it needs to be dire, since there
are multiple differences to consider:
* We have a type system, so the vertex is obviously different.
* Even if a vertex was just a set of one set, it would still have a unique shape:
  * [Array(1)] !== [Array(2)], or [['a']] (Vertex) !== [['a','b']] (Undirected
  edge/hyperedge)

On one hand, the generality afforded by the simplical sets is rather attractive:
* All edges are 1-simplexes. It is the type and morphisms defined for each kind
  of edge which determine the interpretation of "direction" or "hyper"-ness.
* Paths are simply ordered sequences of simplexes.

On the other hand, we still have the issue of really defining what an undirected
hyperedge is in the terms of a 1-simplex instead of a 0-simplex where it is
simply a 0-simplex indicating coincidence between 2 or more vertices. Or is a
hyperedge between n vertices really the same thing as an n-simplex? If it is,
then a directed hyperedge seems like it would need an n-simplex and an m-simplex
for each tail and head instead of being a 1-simplex with n and m vertices in each
set.

This brings me back around to one of my original issues with defining a loop and
the differences between an undirected loop and a directed loop:
* A directed loop is simple:
  * [['a'],['a']] (directed loop) or [['a','b'],['a','b']] (directed hyperloop)
* An undirected loop is less simple because there is no direction and it is just
  self coincident, but the standard definition of an undirected loop is the same
  as the directed loop:
  * [['a'],['a']] (undirected loop)
* But now, we are forced to define an undirected hyperloop in an analogous manner
  to the directed hyperloop: [['a','b'],['a','b']] (undirected hyperloop). Is
  this a bad thing? It does make it obvious that it's a loop. On the other hand,
  does this actually exist? Is there a concept of an undirected hyperloop in
  reality?

To go back to the undirected hyperedge discussion, the hyperedge is just a set
which indicates coincidence. By this definition, it seems that the only loop
possible to define is a self-incident vertex: [['a']]. Additionally, in a data
structure corresponding to a 1-simplex how is it even possible to map a single
set without it looking like a vertex? The only ways I can think of doing this are
with the current implementation and it's transpose:
* Current:
  * [['a'], []] (undirected loop)
  * [['a','b'], []] (undirected edge)
  * [['a','b','c'], []] (undirected hyperedge)
* Transpose:
  * [[], ['a']] (undirected loop)
  * [[], ['a','b']] (undirected edge)
  * [[], ['a','b','c']] (undirected hyperedge)

Additionally, I need decided on how I decide what a hyperloop is. Currently, it
only decides a hyperedge edge is a hyperloop if both tail and head sets contain
the same elements. However, this could still count as a loop if only one element
overlaps. For instace, [['a','b','c'],['d','e','f','a']] may still count as a
loop, even though the two sets contain different numbers of elements and only
have one pair that defines a directed loop. Perhaps for now, I'll use different
methods and provide a version that reduces with an AND and another that reduces
with an OR.

Finally, what are these?

* directed 1-simplex: [['a','b','c'],['d','e','f']] &mdash; a directed hyperedge
* directed 2-simplex: [['a','b','c'],['d','e','f'],['g','h','i']] &mdash; is this a chain?
* directed 3-simplex: [['a','b','c'],['d','e','f'],['g','h','i'],['j','k','l']]

These a 3-uniform, but they don't have to be.


**Papers Mentioning Hyperloops**
* [Pearson, K. J. (2015). Spectral hypergraph theory of the adjacency hypermatrix and matroids. Linear Algebra and its Applications, 465, 176-187.](https://doi.org/10.1016/j.laa.2014.09.025)
* [Leal, W., Eidi, M., & Jost, J. (2020). Ricci curvature of random and empirical directed hypernetworks. Applied network science, 5(1), 1-14.](https://doi.org/10.1007/s41109-020-00309-8)
* [Surana, A., Chen, C., & Rajapakse, I. (2021). Hypergraph dissimilarity measures. arXiv preprint arXiv:2106.08206.](https://arxiv.org/abs/2106.08206)

**Simplical Sets, Nerves, etc.**
* [Eilenberg, S., & Zilber, J. A. (1950). Semi-simplicial complexes and singular homology. Annals of Mathematics, 499-513.](https://doi.org/10.2307/1969364)
* [Segal, G. (1968). Classifying spaces and spectral sequences. Publications Mathématiques de l'IHÉS, 34, 105-112.](http://www.numdam.org/article/PMIHES_1968__34__105_0.pdf)
* [Segal, G. (1974). Appendix A. Categories and cohomology theories. Topology, 13(3), 293-312.](https://doi.org/10.1016/0040-9383(74)90022-6)
* [May, J. P. (1992). Simplicial Objects in Algebraic Topology. United Kingdom: University of Chicago Press.](https://www.google.com/books/edition/Simplicial_Objects_in_Algebraic_Topology/QGjwV0gyQnIC?hl=en&gbpv=1&dq=J.%20P.%20May.%20Simplicial%20Objects%20in%20Algebraic%20Topology.%20D.%20Van%20Norstrand%201967%3B%20reprinted%20by%20the%20University%20of%20Chicago%20Press%201982%20and%201992.&pg=PA1&printsec=frontcover)
* [Rezk, C., Schwede, S., & Shipley, B. (2001). Simplicial structures on model categories and functors. American Journal of Mathematics, 123(3), 551-575.](https://arxiv.org/abs/math/0101162)
* [Goerss, P. G., & Hopkins, M. J. (2003). Moduli spaces of commutative ring spectra. Preprint.](https://sites.math.northwestern.edu/~pgoerss/papers/sum.pdf)
* [Blanc, D., Dwyer, W. G., & Goerss, P. G. (2004). The realization space of a Π-algebra: a moduli problem in algebraic topology. Topology, 43(4), 857-892.](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.148.6377&rep=rep1&type=pdf)
* [Weber, M. (2007). Familial 2-functors and parametric right adjoints. Theory Appl. Categ, 18(22), 665-732.](http://www.tac.mta.ca/tac/volumes/18/22/18-22.pdf)
* [Moerdijk, I., & Weiss, I. (2007). Dendroidal sets. Algebraic & Geometric Topology, 7(3), 1441-1470.](http://dx.doi.org/10.2140/agt.2007.7.1441)
* [Friedman, G. (2008). An elementary illustrated introduction to simplicial sets. arXiv preprint arXiv:0809.4221.](https://arxiv.org/abs/0809.4221)
* [Riehl, E. (2011). A leisurely introduction to simplicial sets. Unpublished expository article available online at http://www.math.harvard.edu/~eriehl.](https://emilyriehl.github.io/files/ssets.pdf)
* [Allegretti, D. G. (2008). Simplicial Sets and van Kampen’s Theorem. Preprint.](http://www.math.uchicago.edu/~may/VIGRE/VIGRE2008/REUPapers/Allegretti.pdf)
* [Gelfand, S. I., Manin, Y. I. (2013). Methods of Homological Algebra. Germany: Springer Berlin Heidelberg.](https://www.google.com/books/edition/Methods_of_Homological_Algebra/MIzqCAAAQBAJ?hl=en&gbpv=1&pg=PA6&printsec=frontcover)
