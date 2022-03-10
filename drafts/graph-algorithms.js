/**

# Layout Algorithm

For layout, we first have to compute the directed subgraph in the {vf:Plan,
vf:Scenario} along with the initial nodes to start graph traversal from:

* Query all vf:Process objects with the vf:plannedWithin relationship with
the {vf:Plan, vf:Scenario} we are looking at along with any vf:Commitment
with a vf:inputOf or vf:outputOf relationship to the set of filtered
vf:Process objects.
* Within that subgraph, find the initial set of input vf:Commitment objects
by searching for the vf:Commitments with no vf:outputOf relationship to any
vf:Process objects in the subgraph we've queried.
* There may be several subgraph fragments to traverse since all vf:Process
nodes may not necessarily be connected to other ones in the {vf:Plan,
vf:Scenario}.

## Separate subgraph fragments

When the organizational graph is queried within a vf:plan/vf:scenario, there may be
multiple subgraph graphs returned which are fragments of the larger graph of
work. We need to separate them out into separate structures.

In other words, given a returned graph A, there may be graphs B and C whose
direct sum forms A. We are more concerned with B and C. Since we can layout
each graph independantly in the UI.

The subgraphs can be isolated by traversing the graph starting at the initial
nodes:

1. Create a temporary graph object to store visited nodes.
2. Choose an initial node and begin graph traversal, marking each node visited
in a separate structure corresponding to the temp graph.
3. Once the graph is traversed, store it in an array.
4. Choose a new initial node from the set of initial node. Traverse the graph
from that point.
  * If a node is visited which corresponds to a previously traversed part of the
    graph, merge the graphs.
  * It it doesn't visit a previously traversed part of the graph, push it onto
    the next array index. Repeat for remaining initial nodes.

## Rendering

Rendering is a little like Conway's Game of Life. Basically, you have a grid
as a given for a metric space. Different things are rendered in various places
based on the state and the interactions with the grid. It's just not as dynamic
as Conway's Game of Life or other cellular automata. Basically:

* There is a fixed grid.
* The various components in the Valueflows graph have to be rendered in
different default sized container <div>s.
* There are columns in between these components which provide space for SVG
based spline curves to be drawn between each component based on their positions
in the final grid.
* There are controls/indicators for adding/removing/splicing into connections at
each point of connection between components.
* There are placeholder components for adding {vf:Commitment, vf:Process} objects
where there are none. 
* A visual representation of a vf:Process has a particular size on the grid and
fills a default size vf:Process box on the grid.
* Based on it's immediate children (the placeholders for the vf:Contract produced
by the process), the default size of the box may change to accommodate all
the children.
* Furthermore, the 2nd generation children (the processes consuming the outputs
of the first process) may optionally figure into the size of the parents.

## Final Layout Steps

To fully layout the grid:
* A complete depth first traversal of each subgraph fragment is used to calculate
basic dimensions and the number of generations in each subgraph fragment (should
likely be stored in an ordered list, for ease of backwards traversal, but a
matrix of measurement objects is also a valid choice).
* Once every basic dimension has been calculated, adjustments need to happen by
propagating the sizes of the output placeholders of the directed graph backwards
all the way to the input objects at the beginning of the directed graph by
applying rules for adjusting the size of each of the parent objects.
The rules are:
  * If a vf:Process has children vf:Commitment components (plus the one
placeholder to add more children) summing to more than it's height, enough row
heights need to be added to the vf:Process's height to allow it's height
to accommodate its children.
  * If a vf:Commitment has children vf:Process components (plus the one
placeholder to add another vf:Process) summing to more than it's height, enough
row heights need to be added to the vf:Commiment's height to accommodate it's
children.
* Once the grid layout is computed, we know exactly where each block will be and
the offsets from its vertical center. This data can be used to calculate SVG
based Bezier curves which can be drawn in the blocks in the columns between the
components representing the {vf:Process, vf:Commitment} objects.
* Once the SVG curves are drawn the HTML fragment can be added to the screen.

An engine like Vue could be used to calculate the differences in the DOM tree
if a complete re-rendering is done, but I doubt we need that since we can just
keep track of the whole subgraph in memory and make any changes to it in tandem
with what's displayed (and we can even use CSS animations!). We should just use
data-attributes and a global (or grid display component) level event handler in
the JS to manage events on any of the components in the graph.

*/


/**
 * Finds the rank of the adjacency matrix
 * 
 * Assumes graph nodes are numbered from 1 to N
 * Assumes gaps in the numbering sequence are intentional
 * 
 * @param {*} graph 
 * @returns 
 */
function find_n(graph) {
    return graph.reduce((p,c) => Math.max(p, c[0], c[1]), 0);
}

/**
 * Creates a map between a more expansive graph and a simplified graph
 * 
 * @param {*} graph 
 * @returns 
 */
function create_index(graph) {
    let index = [];
    for (let [i,j] of graph) {
        if (index.indexOf(i) === -1) index.push(i);
        if (index.indexOf(j) === -1) index.push(j);
    }
    return index;
}

/**
 * Constructs an adjacency matrix for a given edge list
 * 
 * @param {*} graph 
 * @returns 
 */
function adjacency_matrix(graph) {
    let n = find_n(graph);
    let adjacency = []

    // Create a zero filled matrix
    for (let i = 0; i < n; i++) {
        adjacency.push((new Array(n)).fill(0));
    }

    // Set the proper elements to 1
    for (let [i, j] of graph) {
        adjacency[i - 1][j - 1] = 1;
    }
    return adjacency;
}

function adjacency_matrix_with_index(graph, index) {
    let n = index.length;
    let adjacency = []

    // Create a zero filled matrix
    for (let i = 0; i < n; i++) {
        adjacency.push((new Array(n)).fill(0));
    }

    // Set the proper elements to 1
    for (let [i, j] of graph) {
        adjacency[index.indexOf(i)][index.indexOf(j)] = 1;
    }
    return adjacency;
}

/**
 * Returns the first node the provided node has edges pointing to, if there is one.
 * 
 * @param i 
 * @param graph
 * @returns null | Number
 */
function next_one(i, graph) {
    return graph.reduce(function(accumulator, edge) {
        if (edge[0] == i){
            accumulator = edge[1];
        }
        return accumulator;
    }, null);
}

/**
 * Returns the first node with an edge pointing to the provided node if there is one.
 * 
 * @param i 
 * @param graph
 * @returns null | Number
 */
 function prev_one(i, graph) {
    return graph.reduce(function(accumulator, edge) {
        if (edge[1] == i){
            accumulator = edge[0];
        }
        return accumulator;
    }, null);
}

/**
 * Returns the set of nodes the provided node has edges pointing to.
 * 
 * @param i 
 * @param graph 
 * @returns Array
 */
function next_set(i, graph) {
    return graph.reduce(function(accumulator, edge) {
        if (edge[0] == i) {
            accumulator.push(edge[1])
        }
        return accumulator;
    }, []);
}

/**
 * Returns the set of nodes having edges pointing to the current node.
 * 
 * @param i 
 * @param graph 
 * @returns Array
 */
 function prev_set(i, graph) {
    return graph.reduce(function(accumulator, edge) {
        if (edge[1] == i) {
            accumulator.push(edge[0])
        }
        return accumulator;
    }, []);
}

/**
 * Returns the number of edges directed outward from the node
 * 
 * @param i 
 * @param graph
 * @returns Number
 */
 function out_edges(i, graph) {
    return graph.reduce(function(accumulator, edge) {
        if (edge[0] == i){
            accumulator++;
        }
        return accumulator;
    }, 0);
}

/**
 * Returns the number of edges directed inward to the node from other nodes
 * 
 * @param i 
 * @param graph
 * @returns Number
 */
 function in_edges(i, graph) {
    return graph.reduce(function(accumulator, edge) {
        if (edge[1] == i){
            accumulator++;
        }
        return accumulator;
    }, 0);
}

/**
 * Merges two nodes into the left most node
 * Assumes i points to j
 * 
 * G1:             G2:
 * i--j--k   ==>   i--k
 *    |            |
 *    +--l         +--l
 * 
 * @param {*} i 
 * @param {*} j 
 */
function merge_nodes_left(i, j, graph) {
    let new_graph = [];

    for (let edge of graph) {

        // Skip if exact match, otherwise we'll accidentally delete an edge
        if (edge[0] === i && edge[1] === j) continue;
        if (edge[0] === j) {

            // Create new edge from i to edge[1]
            new_graph.push([i, edge[1]]);
        } else {

            // Push a new edge array onto the graph as a copy
            new_graph.push([edge[0], edge[1]]);
        }
    }

    return new_graph;
}

/**
 * Skips the next node
 * 
 * G3:               G4:
 * i-->k-->l   ==>   i-->l
 *     ^                 ^
 *     |                 |
 *     j             j-->k
 * 
 * @param {*} i 
 * @param {*} graph 
 * @returns 
 */
function skip_next_node(i, graph) {
    let new_graph = [];

    for (let edge of graph) {
        if (edge[0] === i) {

            // Push an edge on the graph from i to next(next(i))
            new_graph.push([i, next_one(edge[1], graph)]);
        } else {

            // Push a new edge array onto the graph as a copy
            new_graph.push([edge[0], edge[1]]);
        }
    }

    return new_graph;
}

/**
 * Iterate over a set of edges multiple times while applying a transformation kernel
 * 
 * @param {*} kernel 
 * @param {*} graph 
 * @param {*} eliminated_nodes 
 * @returns 
 */
function transform_graph(kernel, graph, eliminated_nodes) {
    if (eliminated_nodes == undefined) eliminated_nodes = [];
    let temp_graph = graph;
    let new_graph = temp_graph;

    do {
        temp_graph = new_graph;
        for (const [i, j] of new_graph) {

            // Skip eliminated nodes
            if (eliminated_nodes.indexOf(i) > -1) continue;

            new_graph = kernel(i, j, new_graph, eliminated_nodes);
        }

    } while (temp_graph.length != new_graph.length)

    for (const [i, j] of new_graph) {

        // Skip eliminated nodes
        if (eliminated_nodes.indexOf(i) > -1) continue;

        new_graph = kernel(i, j, new_graph, eliminated_nodes);
    }

    return new_graph;
}

function kernel_simplify_single_node_path(i , j, graph, eliminated_nodes) {
    let new_graph = graph;

    if (
        out_edges(i, new_graph) === 1
        && in_edges(j, new_graph) === 1
        && out_edges(j, new_graph) >= 1
    ) {
        // Mark node as eliminated
        eliminated_nodes.push(j);

        // replaces next_one(i) with i and moves the origin of next_one(i)'s edges to i
        new_graph = merge_nodes_left(i, j, new_graph);
    }

    return new_graph;
}

function kernel_simplify_single_edges(i, j, graph, eliminated_nodes) {
    let new_graph = graph;
    let next = next_one(j, new_graph);

    if (
      out_edges(i, new_graph) == 1
      && out_edges(j, new_graph) == 1
      && in_edges(next, new_graph) > 1
    ) {
        // Mark node as eliminated
        if (eliminated_nodes.filter(node => node == j).length == 0) {
            eliminated_nodes.push(j);
        }

        // replace edge (i, next_one(i)) with an edge (i, next_one(next_one(i)))
        new_graph = skip_next_node(i, new_graph);
    }

    return new_graph;
}

function kernel_simplify_branching(i, j, graph, eliminated_nodes) {
    let new_graph = graph;

    if (
        in_edges(i, new_graph) == 1
        && out_edges(i, new_graph) > 1
    ) {
        // Mark node as eliminated
        eliminated_nodes.push(i);

        // replace edge i
        new_graph = merge_nodes_left(prev_one(i, new_graph), i, new_graph);
    }

    return new_graph;
}

/**
 * Simplify the graph as much as possible by shortening paths through
 * multiple nodes with only one output and one input
 * 
 * Assumes that only this algorithm is operating on the graph, otherwise
 * we would have to check to ensure graph isomorphism at each iteration
 * 
 * @param {*} graph 
 * @param {*} eliminated_nodes 
 * @returns 
 */
function simplify_single_node_paths(graph, eliminated_nodes) {
    if (eliminated_nodes == undefined) eliminated_nodes = [];
    return transform_graph(kernel_simplify_single_node_path, graph, eliminated_nodes);
}

/**
 * Take any two nodes connected by a single edge and create an edge directly
 * from the input nodes of the first edge to the second node
 * 
 * Same assumptions as above
 * 
 * @param {*} graph 
 * @param {*} eliminated_nodes 
 * @returns 
 */
function simplify_single_edges(graph, eliminated_nodes) {
    if (eliminated_nodes == undefined) eliminated_nodes = [];
    let simplified = transform_graph(kernel_simplify_single_edges, graph, eliminated_nodes);
    for (let e of eliminated_nodes) {
        simplified = simplified.filter(edge => !(edge[0] === e | edge[1] === e));
    }
    return simplified;
}

/**
 * Find a intermediate branching node and merge it into the previous node
 * 
 * Same assumptions as above
 * 
 * @param {*} graph 
 * @param {*} eliminated_nodes 
 * @returns 
 */
function simplify_branching(graph, eliminated_nodes) {
    if (eliminated_nodes == undefined) eliminated_nodes = [];
    return transform_graph(kernel_simplify_branching, graph, eliminated_nodes);
}

/**
 * Create an abbreviated graph through topology preserving surgery
 * 
 * This operation removes nodes from the graph creating a simpler graph
 * while preserving topology and node ordering.
 * 
 * This can be used to compute the number of grid rows used to display a graph:
 *   max(max(out_edges(i)), max(in_edges(i)))
 * 
 * Since the indexing of nodes is preserved, it's easy to compute what row a
 * node will need to be rendered in along with the height of the column.
 * 
 * @param graph 
 * @returns Array
 */
 function simplify_graph(graph) {
    let new_graph = graph;

    new_graph = simplify_single_node_paths(new_graph);

    new_graph = simplify_single_edges(new_graph);

    new_graph = simplify_branching(new_graph);

    return new_graph;
}


