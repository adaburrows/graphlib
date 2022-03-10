import { } from "../../src";

/**
 * Number of nodes
 */
const N = 29;

/**
 * Full adjacency matrix A for graph G.
 * A_{i}_{j} (or, A[i-1][j-1]) defines an edge from node i to node j.
 * This is very wasteful, since the matrix is sparse.
 */
const A = [
  //1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29

  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 1
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 2
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 3
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 4
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 5
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 6
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 7
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 8
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 9
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //10
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //11
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //12
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //13
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //14
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //15
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], //16
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], //17
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], //18
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0], //19
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], //20
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], //21
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], //22
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], //23
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0], //24
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], //25
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], //26
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], //27
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], //28
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //29
];


/**
 * Directed graph G.
 * Each array entry e defines a directed edge from node e_1 to e_2 (or, e[0] to e[1])
 */
const G = [
  [1, 4], [2, 5], [4, 6], [5, 7],
  [6, 8], [7, 8], [3, 9], [8, 10],
  [9, 11], [10, 12], [11, 12], [12, 13],
  [12, 14], [13, 15], [14, 16], [15, 17],
  [15, 18], [16, 19], [16, 20], [17, 21],
  [18, 22], [19, 23], [20, 24], [21, 25],
  [22, 26], [23, 27], [24, 28], [25, 29],
  [26, 29], [27, 29], [28, 29]
];
const G_merge_4_6 = [
  [1, 4], [2, 5], [5, 7],
  [4, 8], [7, 8], [3, 9],
  [8, 10], [9, 11], [10, 12],
  [11, 12], [12, 13], [12, 14],
  [13, 15], [14, 16], [15, 17],
  [15, 18], [16, 19], [16, 20],
  [17, 21], [18, 22], [19, 23],
  [20, 24], [21, 25], [22, 26],
  [23, 27], [24, 28], [25, 29],
  [26, 29], [27, 29], [28, 29]
];
const G_rule1 = [
  [1, 8], [2, 8],
  [8, 12], [3, 12],
  [12, 13], [12, 14],
  [13, 17], [13, 18],
  [14, 19], [14, 20],
  [17, 29], [18, 29],
  [19, 29], [20, 29]
];
const G_rule2 = [
  [1, 12], [2, 12],
  [3, 12], [12, 13],
  [12, 14], [13, 17],
  [13, 18], [14, 19],
  [14, 20], [17, 29],
  [18, 29], [19, 29],
  [20, 29]
];
const G_rule3 = [
  [1, 12], [2, 12],
  [3, 12], [12, 17],
  [12, 18], [12, 19],
  [12, 20], [17, 29],
  [18, 29], [19, 29],
  [20, 29]
];

const G1 = [[1, 2], [2, 3], [2, 4]];
const G2 = [[1, 3], [1, 4]];

const G3 = [[1, 3], [2, 3], [3, 4]];
const G4 = [[1, 4], [2, 3], [3, 4]];

const G_line = [[1, 2], [2, 3], [3, 4], [4, 5]];


console.log(N, A, G, G_merge_4_6, G_rule1, G_rule2, G_rule3, G1, G2, G3, G4, G_line);


// console.log(N === find_n(G));
// console.log(adjacency_matrix(G)); // should equal A
// console.log(4 === next_one(1, G));
// console.log(2 === prev_one(5, G));
// console.log([13, 14].values === next_set(12, G).values);
// console.log([25, 26, 27, 28].values === prev_set(29 ,G).values);
// console.log(2 === out_edges(12, G));
// console.log(4 === in_edges(29, G));
// console.log(merge_nodes_left(1, 2, G1)); //should equal G2;
// console.log(merge_nodes_left(4,6, G)); // should equal G_merge_4_6
// console.log(skip_next_node(1, G3)); // should equal G4
// console.log(simplify_single_node_paths(G_line)); // should equal [ [1, 5] ]
// console.log(simplify_single_node_paths(G));
// console.log(simplify_single_edges(G_rule1)); // should be equal to G_rule2
// console.log(simplify_branching(G_rule2)); // should be equal to G_rule3 */

// let simplified = simplify_graph(G);
// let simplified_index = create_index(simplified);
// let simplified_adjacency_matrix = adjacency_matrix_with_index(simplified, simplified_index);
// let simplified_transpose = transpose(simplified_adjacency_matrix);
// let simplified_undirected = sum(simplified_transpose, simplified_adjacency_matrix);

// console.log(simplified); // should be equal to G_rule3
// console.log(G_rule3);
// console.log(simplified_index);
// console.log(simplified_undirected);