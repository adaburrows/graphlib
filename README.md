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

## A Deeper Look at The Math

For those needing a refresher:

* {} is an unordered set
* () is an orderd set (tuple)
* Any captial letter refers to one of the above.
* A lower case letter refers to an element of one of the above.

We can define the folowing:

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
    * In a dihypergraph, it connects a set of head vertices to a set of tail vertices.

## Reading

In 2020, I was thinking about this problem and before I fully understood the
pattern I was seeing I ran across a few papers that inspired me:

* [Plessas, D. J. (2011). The categories of graphs. University of Montana.](https://scholarworks.umt.edu/etd/967)
* [McRae, G., Plessas, D., & Rafferty, L. (2012). On the Concrete Categories of Graphs. arXiv preprint arXiv:1211.6715.](https://arxiv.org/abs/1211.6715)

Additionally, the following were helpful for clarifying some concepts:

* [Gallo, G., Longo, G., Pallottino, S., & Nguyen, S. (1993). Directed hypergraphs and applications. Discrete applied mathematics, 42(2-3), 177-201\.](https://www.sciencedirect.com/science/article/pii/0166218X9390045P)
* [Klamt S, Haus U-U, Theis F (2009) Hypergraphs and Cellular Networks. PLoS Comput Biol 5(5): e1000385\. https://doi.org/10.1371/journal.pcbi.1000385](https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1000385)
* [Thakur, M., & Tripathi, R. (2009). Linear connectivity problems in directed hypergraphs. Theoretical Computer Science, 410(27-29), 2592-2618\.](https://www.sciencedirect.com/science/article/pii/S0304397509002011)
* [Galeana-Sánchez, H., & Manrique, M. (2009). Directed hypergraphs: A tool for researching digraphs and hypergraphs. Discussiones Mathematicae Graph Theory, 29(2), 313-335\.](https://www.researchgate.net/publication/220468816_Directed_hypergraphs_A_tool_for_researching_digraphs_and_hypergraphs)
* [Butts, C. T. (2010). A note on generalized edges.](https://www.imbs.uci.edu/files/docs/technical/2010/mbs_10-03.pdf)
* [Gao, Y., Wang, M., Zha, Z. J., Shen, J., Li, X., & Wu, X. (2012). Visual-textual joint relevance learning for tag-based social image search. IEEE Transactions on Image Processing, 22(1), 363-376\.](https://ieeexplore.ieee.org/document/6212356)
* [Javaid, I., Haider, A., Salman, M., & Mehtab, S. (2014). Resolvability in Hypergraphs. arXiv preprint arXiv:1408.5513\.](https://arxiv.org/abs/1408.5513v2)
* [Ritz, A., Tegge, A. N., Kim, H., Poirel, C. L., & Murali, T. M. (2014). Signaling hypergraphs. Trends in biotechnology, 32(7), 356-362\.](https://www.sciencedirect.com/science/article/abs/pii/S0167779914000717)
* [Ritz, A., Avent, B., & Murali, T. M. (2015). Pathway analysis with signaling hypergraphs. IEEE/ACM transactions on computational biology and bioinformatics, 14(5), 1042-1055\.](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5810418/)
* [Ausiello, G., & Laura, L. (2017). Directed hypergraphs: Introduction and fundamental algorithms---a survey. Theoretical Computer Science, 658, 293-306\.](https://www.sciencedirect.com/science/article/pii/S0304397516002097?via%3Dihub)
* [Kamiński B, Poulin V, Prałat P, Szufel P, Théberge F (2019) Clustering via hypergraph modularity. PLoS ONE 14(11): e0224307\. https://doi.org/10.1371/journal.pone.0224307](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0224307)
* [Vieira, L. S., & Vera-Licona, P. (2019). Computing Signal Transduction in Signaling Networks modeled as Boolean Networks, Petri Nets, and Hypergraphs. bioRxiv, 272344\.](https://www.biorxiv.org/content/10.1101/272344v3)
* [Vieira, L. S., & Vera-Licona, P. (2019). Supplementary Information: Computing Signal Transduction in Signaling Networks modeled as Boolean Networks, Petri Nets, and Hypergraphs. bioRxiv, 272344\.](https://www.biorxiv.org/content/biorxiv/suppl/2018/07/10/272344.DC1/272344-1.pdf)
* [Franzese N, Groce A, Murali TM, Ritz A (2019) Hypergraph-based connectivity measures for signaling pathway topologies. PLoS Comput Biol 15(10): e1007384\. https://doi.org/10.1371/journal.pcbi.1007384](https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1007384)
* [Presentation Board. Franzese N, Groce A, Murali TM, Ritz A (2019) Hypergraph-based connectivity measures for signaling pathway topologies. PLoS Comput Biol 15(10): e1007384\.](https://www.reed.edu/biology/ritz/files/posters/2017-franzese-potter-groce-fix-ritz.pdf)
* [Eidi, M., & Jost, J. (2020). Ollivier ricci curvature of directed hypergraphs. Scientific Reports, 10(1), 1-14\.](https://www.nature.com/articles/s41598-020-68619-6)
* [Do, M. T., Yoon, S. E., Hooi, B., & Shin, K. (2020, August). Structural patterns and generative models of real-world hypergraphs. In Proceedings of the 26th ACM SIGKDD International Conference on Knowledge Discovery & Data Mining (pp. 176-186).](https://www.researchgate.net/publication/342169087_Structural_Patterns_and_Generative_Models_of_Real-world_Hypergraphs)
* [Lee, G., Choe, M., & Shin, K. (2021, April). How Do Hyperedges Overlap in Real-World Hypergraphs?-Patterns, Measures, and Generators. In Proceedings of the Web Conference 2021 (pp. 3396-3407).](https://dl.acm.org/doi/abs/10.1145/3442381.3450010)

Here are papers on hyperpaths which I've been thinking about:

* [Nguyen, S., & Pallottino, S. (1989). Hyperpaths and shortest hyperpaths. In Combinatorial Optimization (pp. 258-271). Springer, Berlin, Heidelberg.](https://link.springer.com/chapter/10.1007/BFb0083470)
* [Nguyen, S., Pallottino, S., & Gendreau, M. (1998). Implicit enumeration of hyperpaths in a logit model for transit networks. Transportation Science, 32(1), 54-64\.](https://pubsonline.informs.org/doi/epdf/10.1287/trsc.32.1.54)
* [Marcotte, P., & Nguyen, S. (1998). Hyperpath formulations of traffic assignment problems. In Equilibrium and advanced transportation modelling (pp. 175-200). Springer, Boston, MA.](https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.43.1143&rep=rep1&type=pdf)
* [Nielsen, L. R., Pretolani, D., & Andersen, K. (2001). A remark on the definition of a B-hyperpath. Technical report, Department of Operations Research, University of Aarhus.](https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.90.8327&rep=rep1&type=pdf)
* [Lozano, A., & Storchi, G. (2002). Shortest viable hyperpath in multimodal networks. Transportation Research Part B: Methodological, 36(10), 853-874\.](https://www.worldtransitresearch.info/research/2092/)
* [Nielsen, L. R., Andersen, K. A., & Pretolani, D. (2005). Finding the K shortest hyperpaths. Computers & operations research, 32(6), 1477-1497\.](https://www.sciencedirect.com/science/article/abs/pii/S0305054803003459)
* [Noh, H., Hickman, M., & Khani, A. (2012). Hyperpaths in network based on transit schedules. Transportation research record, 2284(1), 29-39\.](https://journals.sagepub.com/doi/abs/10.3141/2284-04)
* [Khani, A., Hickman, M., & Noh, H. (2015). Trip-based path algorithms using the transit network hierarchy. Networks and Spatial Economics, 15(3), 635-653\.](https://link.springer.com/article/10.1007/s11067-014-9249-3)
* [Xu, Z., Xie, J., Liu, X., & Nie, Y. M. (2020). Hyperpath-based algorithms for the transit equilibrium assignment problem. Transportation Research Part E: Logistics and Transportation Review, 143, 102102\.](https://www.sciencedirect.com/science/article/abs/pii/S136655452030750X)
* [Miller, J., Nie, Y., & Liu, X. (2020). Hyperpath truck routing in an online freight exchange platform. Transportation Science, 54(6), 1676-1696\.](https://pubsonline.informs.org/doi/abs/10.1287/trsc.2020.0989)
* [Dahari, A., & Linial, N. (2020). Hyperpaths. arXiv preprint arXiv:2011.09936\.](https://arxiv.org/abs/2011.09936)
* [Krieger, S., Kececioglu, J. (2021) Approaches for shortest hyperpath and minimum-hyperedge factories in directed hypergraphs](http://hyperpaths.cs.arizona.edu/)
* [What is a hyperpath, anyway?](https://fast-trips.mtc.ca.gov/2016/04/21/What-is-a-hyperpath-anyway/)

Also, here are some category theoretic papers on open graphs:


* [Dixon, L., & Kissinger, A. (2013). Open-graphs and monoidal theories. Mathematical Structures in Computer Science, 23(2), 308-359.](https://arxiv.org/abs/1011.4114)
* [Kissinger, A. (2014). Finite matrices are complete for (dagger-) hypergraph categories. arXiv preprint arXiv:1406.5942.](https://arxiv.org/abs/1406.5942)
* [Fong, B. (2015). Decorated cospans. arXiv preprint arXiv:1502.00872.](https://arxiv.org/abs/1502.00872)
* [Fong, B. (2016). The algebra of open and interconnected systems. arXiv preprint arXiv:1609.05382.](https://arxiv.org/abs/1609.05382)
* [Bonchi, F., Seeber, J., & Sobocinski, P. (2018). Graphical conjunctive queries. arXiv preprint arXiv:1804.07626.](https://arxiv.org/abs/1804.07626)
[Proudfoot, N., & Ramos, E. (2019). The contraction category of graphs. arXiv preprint arXiv:1907.11234.](https://arxiv.org/abs/1907.11234)
* [Jenča, G. (2019). Two monads on the category of graphs. Mathematica Slovaca, 69(2), 257-266.](https://arxiv.org/abs/1706.00081)
* [Master, J. (2020). The open algebraic path problem. arXiv preprint arXiv:2005.06682.](https://arxiv.org/pdf/2005.06682.pdf)
* [Patterson, E., Lynch, O., & Fairbanks, J. (2021). Categorical Data Structures for Technical Computing. arXiv preprint arXiv:2106.04703.](https://arxiv.org/abs/2106.04703)
* [Patterson, E., Lynch, O., & Fairbanks, J. (2021). Categorical Data Structures for Technical Computing. arXiv preprint arXiv:2106.04703.](https://arxiv.org/pdf/2106.04703.pdf)
* [Chih, T., & Scull, L. (2021). A homotopy category for graphs. Journal of Algebraic Combinatorics, 53(4), 1231-1251.](https://arxiv.org/abs/1901.01619)
* [Hackney, P. (2021). Categories of graphs for operadic structures. arXiv preprint arXiv:2109.06231.](https://arxiv.org/abs/2109.06231)
* [Bumpus, B. M., & Kocsis, Z. A. (2021). Spined categories: generalizing tree-width beyond graphs. arXiv preprint arXiv:2104.01841.](https://arxiv.org/abs/2104.01841)
* [Master, J. E. (2021). Composing Behaviors of Networks. University of California, Riverside.](https://arxiv.org/pdf/2105.12905.pdf)
* [networks_robotics_web.pdf](https://math.ucr.edu/home/baez/robotics/networks_robotics_web.pdf)
