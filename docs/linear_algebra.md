# Graphs + Linear Algebra

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