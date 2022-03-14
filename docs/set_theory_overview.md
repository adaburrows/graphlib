## Set Theory Overview

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
