import {
  Edge,
  UndirectedEdge,
  DirectedEdge,
  UndirectedHyperedge,
  DirectedHyperedge,
} from '../../src';

/*

In some ways, I feel like most of these tests are redundant because of the type
system. However, if we change the implementation, this will ensure we don't
break anything.

*/

describe('UndirectedEdge should accept a vertex key pair and', () => {
  it ('should return the first element with the x morphism', () => {
    const E = new UndirectedEdge('A', 'B');
    expect(E.x).toEqual('A');
  });

  it('should set the first element with the x setter', () => {
    const E = new UndirectedEdge('A', 'B');
    E.x = 'C';
    expect(E.x).toEqual('C');
  });

  it('should return the second element with the y morphism', () => {
    const E = new UndirectedEdge('A', 'B');
    expect(E.y).toEqual('B');
  });

  it('should set the second element with the y setter', () => {
    const E = new UndirectedEdge('A', 'B');
    E.y = 'C';
    expect(E.y).toEqual('C');
  });

  it('should indicate if the edge is a loop', () => {
    const E = new UndirectedEdge('A', 'A');
    const F = new UndirectedEdge(1,1);
    expect(E.isLoop).toEqual(true);
    expect(F.isLoop).toEqual(true);
  });

  it('should map to a right oriented directed edge', () => {
    const E = new UndirectedEdge('A', 'B');
    const D = E.toRight();
    expect(D instanceof DirectedEdge).toEqual(true);
    expect(D.t).toEqual('A');
    expect(D.h).toEqual('B');
  });

  it('should map to a left oriented directed edge', () => {
    const E = new UndirectedEdge('A', 'B');
    const D = E.toLeft();
    expect(D instanceof DirectedEdge).toEqual(true);
    expect(D.t).toEqual('B');
    expect(D.h).toEqual('A');
  });

  it('should map to a right oriented directed edge', () => {
    const E = new UndirectedEdge('A', 'B');
    const D = E.toRightHyperedge();
    expect(D instanceof DirectedHyperedge).toEqual(true);
    expect(D.t).toEqual(['A']);
    expect(D.h).toEqual(['B']);
  });

  it('should map to a left oriented directed hyperedge', () => {
    const E = new UndirectedEdge('A', 'B');
    const D = E.toLeftHyperedge();
    expect(D instanceof DirectedHyperedge).toEqual(true);
    expect(D.t).toEqual(['B']);
    expect(D.h).toEqual(['A']);
  });

  it('should map to a hyperedge', () => {
    const E = new UndirectedEdge('A', 'B');
    const D = E.toUndirectedHyperedge();
    expect(D instanceof UndirectedHyperedge).toEqual(true);
    expect(D.vertices.S).toEqual(['A','B']);
    expect(D.vertices.L).toEqual(['A','B']);
  });

  it('should determine that two adjacent edges can connect to each other', () => {
    const E1 = new UndirectedEdge('A', 'B');
    const E2 = new UndirectedEdge('B', 'C');
    expect(E1.connectsTo(E2)).toEqual(true);
    expect(E2.connectsTo(E1)).toEqual(true);
  });

  it('should determine that two non-adjacent edges cannot connect to each other', () => {
    const E1 = new UndirectedEdge('A', 'B');
    const E2 = new UndirectedEdge('C', 'D');
    expect(E1.connectsTo(E2)).toEqual(false);
    expect(E2.connectsTo(E1)).toEqual(false);
  });
});

describe('DirectedEdge should accept a vertex pair and', () => {
  it('should return the head element with the h morphism', () => {
    const E = new DirectedEdge('A', 'B');
    expect(E.h).toEqual('B');
  });

  it('should set the head element with the h setter', () => {
    const E = new DirectedEdge('A', 'B');
    E.h = 'C';
    expect(E.h).toEqual('C');
  });

  it('should return the tail element with the t morphism', () => {
    const E = new DirectedEdge('A', 'B');
    expect(E.t).toEqual('A');
  });

  it('should set the tail element with the t setter', () => {
    const E = new DirectedEdge('A', 'B');
    E.t = 'C';
    expect(E.t).toEqual('C');
  });

  it('should indicate if the edge is a loop', () => {
    const E = new DirectedEdge('A', 'A');
    const F = new DirectedEdge(1,1);
    expect(E.isLoop).toEqual(true);
    expect(F.isLoop).toEqual(true);
  });

  it('should map to a directed hyperedge', () => {
    const E = new DirectedEdge('A', 'B');
    const D = E.toDirectedHyperedge();
    expect(D instanceof DirectedHyperedge).toEqual(true);
    expect(D.t).toEqual(['A']);
    expect(D.h).toEqual(['B']);
  });

  it('should map to an undirected edge', () => {
    const E = new DirectedEdge('A', 'B');
    const D = E.toUndirectedEdge();
    expect(D instanceof UndirectedEdge).toEqual(true);
    expect(D.x).toEqual('A');
    expect(D.y).toEqual('B');
  });

  it('should determine that two adjacent edges can connect to each other', () => {
    const E1 = new DirectedEdge('A', 'B');
    const E2 = new DirectedEdge('B', 'C');
    expect(E1.connectsTo(E2)).toEqual(true);
    expect(E2.connectsTo(E1)).toEqual(false); // Directed edges don't connect that way
  });

  it('should determine that two non-adjacent edges cannot connect to each other', () => {
    const E1 = new DirectedEdge('A', 'B');
    const E2 = new DirectedEdge('C', 'D');
    expect(E1.connectsTo(E2)).toEqual(false);
    expect(E2.connectsTo(E1)).toEqual(false);
  });
});

describe('UndirectedHyperedge', () => {
  it('should return the size of the edge', () => {
    const nodes = ['A', 'B', 'C', 'D'];
    const E = new UndirectedHyperedge(nodes);
    expect(E.size).toEqual(4);
  });

  it('should indicate if the edge is a loop', () => {
    const nodes = ['A', 'A'];
    const E = new UndirectedHyperedge(nodes);
    expect(E.isLoop).toEqual(true);
  });

  it('should determine that two adjacent edges can connect to each other', () => {
    const E1 = new UndirectedHyperedge(['A', 'B']);
    const E2 = new UndirectedHyperedge(['B', 'C']);
    expect(E1.connectsTo(E2)).toEqual(true);
    expect(E2.connectsTo(E1)).toEqual(true);
  });

  it('should determine that two non-adjacent edges cannot connect to each other', () => {
    const E1 = new UndirectedHyperedge(['A', 'B']);
    const E2 = new UndirectedHyperedge(['D', 'C']);
    expect(E1.connectsTo(E2)).toEqual(false);
    expect(E2.connectsTo(E1)).toEqual(false);
  });
});

describe('DirectedHyperedge should', () => {
  /*
   * ┌─┐  ┌─┐
   * │A│  │C│
   * │ │->│ │ 
   * │B│  │D│
   * └─┘  └─┘
   */
  it('should return the size of the edge', () => {
    const nodes = ['A', 'B', 'C', 'D'];
    const E = new DirectedHyperedge(nodes.slice(0,2), nodes.slice(2,4));
    expect(E.size).toEqual(4);
  });
  
  it('should return the head set with the h morpism', () => {
    const nodes = ['A', 'B', 'C', 'D'];
    const E = new DirectedHyperedge(nodes.slice(0,2), nodes.slice(2,4));
    expect(E.h).toEqual(nodes.slice(2,4));
  });

  /*
   * ┌─┐  ┌─┐    ┌─┐  ┌─┐
   * │A│  │C│    │A│  │E│
   * │ │->│ │ => │ │->│ │ 
   * │B│  │D│    │B│  │F│
   * └─┘  └─┘    └─┘  └─┘
   */
  it('should set the head set with the h setter', () => {
    const nodes = ['A', 'B', 'C', 'D','E', 'F'];
    const E = new DirectedHyperedge(nodes.slice(0,2), nodes.slice(2,4));
    E.h = nodes.slice(4,6);
    expect(E.h).toEqual(nodes.slice(4,6));
  });

  it('should return the tail set with the t morphism', () => {
    const nodes = ['A', 'B', 'C', 'D'];
    const E = new DirectedHyperedge(nodes.slice(0,2), nodes.slice(2,4));
    expect(E.t).toEqual(nodes.slice(0,2));
  });

  /*
   * ┌─┐  ┌─┐    ┌─┐  ┌─┐
   * │A│  │C│    │E│  │C│
   * │ │->│ │ => │ │->│ │ 
   * │B│  │D│    │F│  │D│
   * └─┘  └─┘    └─┘  └─┘
   */
  it('should set the tail set with the t setter', () => {
    const nodes = ['A', 'B', 'C', 'D','E', 'F'];
    const E = new DirectedHyperedge(nodes.slice(0,2), nodes.slice(2,4));
    E.t = nodes.slice(4,6);
    expect(E.t).toEqual(nodes.slice(4,6));
  });

  it('should indicate if the size 2 edge is a loop', () => {
    const nodes = ['A'];
    const E = new DirectedHyperedge(nodes, nodes);
    expect(E.isLoop).toEqual(true);
    expect(E.t).toEqual(nodes);
    expect(E.h).toEqual(nodes);
  });

  it('should indicate if the size 4 edge is a loop', () => {
    const nodes = ['A', 'B'];
    const E = new DirectedHyperedge(nodes, nodes);
    expect(E.isLoop).toEqual(true);
    expect(E.t).toEqual(nodes);
    expect(E.h).toEqual(nodes);
  });

  it('should indicate if the size 5 edge is a loop', () => {
    const nodes1 = ['A', 'B'];
    const nodes2 = ['A', 'B', 'C'];
    const E = new DirectedHyperedge(nodes1, nodes2);
    expect(E.isLoop).toEqual(true);
    expect(E.t).toEqual(nodes1);
    expect(E.h).toEqual(nodes2);
  });

  it('should indicate if the size 5 edge is not a loop', () => {
    const nodes1 = ['A', 'B'];
    const nodes2 = ['A', 'B', 'C'];
    const E = new DirectedHyperedge(nodes1, nodes2);
    expect(E.isLoopStrict).toEqual(false);
    expect(E.t).toEqual(nodes1);
    expect(E.h).toEqual(nodes2);
  });

  it('should determine that two adjacent edges can connect to each other', () => {
    const E1 = new DirectedHyperedge(['A', 'B'], ['C', 'D']);
    const E2 = new DirectedHyperedge(['D', 'E'], ['F', 'G']);
    expect(E1.connectsTo(E2)).toEqual(true);
    expect(E2.connectsTo(E1)).toEqual(false); // Directed edges can't connect this way
  });

  it('should determine that two non-adjacent edges cannot connect to each other', () => {
    const E1 = new DirectedHyperedge(['A', 'B'], ['C', 'D']);
    const E2 = new DirectedHyperedge(['F', 'E'], ['H', 'G']);
    expect(E1.connectsTo(E2)).toEqual(false);
    expect(E2.connectsTo(E1)).toEqual(false);
  });
});

describe('making a labeled edge with a mixin', () => {
  it('should work', () => {
    type EdgeConstructor = new (...args: any[]) => Edge;

    function Labeled<T extends EdgeConstructor>(Base: T) {
      return class Labeled extends Base {
        public label: string | null = null;
      }
    }

    const ArrowWithLabel = Labeled(DirectedEdge);

    const edge = new ArrowWithLabel('a', 'b');
    edge.label = 'Hello';
    expect(edge.label).toEqual('Hello');
  });
});