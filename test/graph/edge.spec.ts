import {
  KeyVertex,
  Undirected,
  Directed,
  UndirectedHyperedge,
  DirectedHyperedge,
} from '../../src';

/*

In some ways, I feel like most of these tests are redundant because of the type
system. However, if we change the implementation, this will ensure we don't
break anything.

*/

describe('Undirected should accept a vertex pair and', () => {
  it ('should return the first element with the x morphism', () => {
    const a = new KeyVertex('A');
    const b = new KeyVertex('B');
    const E = new Undirected([a, b]);
    expect(E.x).toEqual(a);
  });

  it('should set the first element with the x setter', () => {
    const a = new KeyVertex('A');
    const b = new KeyVertex('B');
    const c = new KeyVertex('C');
    const E = new Undirected([a, b]);
    E.x = c;
    expect(E.x).toEqual(c);
  });

  it('should return the second element with the y morphism', () => {
    const a = new KeyVertex('A');
    const b = new KeyVertex('B');
    const E = new Undirected([a, b]);
    expect(E.y).toEqual(b);
  });

  it('should set the second element with the y setter', () => {
    const a = new KeyVertex('A');
    const b = new KeyVertex('B');
    const c = new KeyVertex('C');
    const E = new Undirected([a, b]);
    E.y = c;
    expect(E.y).toEqual(c);
  });

  it('should map to a right oriented directed edge', () => {
    const a = new KeyVertex('A');
    const b = new KeyVertex('B');
    const E = new Undirected([a, b]);
    const D = E.toRight();
    expect(D instanceof Directed).toBe(true);
    expect(D.h).toEqual(a);
    expect(D.t).toEqual(b);
  });

  it('should map to a left oriented directed edge', () => {
    const a = new KeyVertex('A');
    const b = new KeyVertex('B');
    const E = new Undirected([a, b]);
    const D = E.toLeft();
    expect(D instanceof Directed).toBe(true);
    expect(D.h).toEqual(b);
    expect(D.t).toEqual(a);
  });

  it('should map to a right oriented directed edge', () => {
    const a = new KeyVertex('A');
    const b = new KeyVertex('B');
    const E = new Undirected([a, b]);
    const D = E.toRightHyperedge();
    expect(D instanceof DirectedHyperedge).toBe(true);
    expect(D.h).toEqual([a]);
    expect(D.t).toEqual([b]);
  });

  it('should map to a left oriented directed hyperedge', () => {
    const a = new KeyVertex('A');
    const b = new KeyVertex('B');
    const E = new Undirected([a, b]);
    const D = E.toLeftHyperedge();
    expect(D instanceof DirectedHyperedge).toBe(true);
    expect(D.h).toEqual([b]);
    expect(D.t).toEqual([a]);
  });

  it('should map to a hyperedge', () => {
    const a = new KeyVertex('A');
    const b = new KeyVertex('B');
    const E = new Undirected([a, b]);
    const D = E.toUndirectedHyperedge();
    expect(D instanceof UndirectedHyperedge).toBe(true);
    expect(D.vertices[0]).toEqual([a,b]);
  });
});

describe('Directed should accept a vertex pair and', () => {
  it('should return the head element with the h morphism', () => {
    const a = new KeyVertex('A');
    const b = new KeyVertex('B');
    const E = new Directed([a, b]);
    expect(E.h).toEqual(a);
  });

  it('should set the head element with the h setter', () => {
    const a = new KeyVertex('A');
    const b = new KeyVertex('B');
    const c = new KeyVertex('C');
    const E = new Directed([a, b]);
    E.h = c;
    expect(E.h).toEqual(c);
  });

  it('should return the target element with the t morphism', () => {
    const a = new KeyVertex('A');
    const b = new KeyVertex('B');
    const E = new Directed([a, b]);
    expect(E.t).toEqual(b);
  });

  it('should set the target element with the t setter', () => {
    const a = new KeyVertex('A');
    const b = new KeyVertex('B');
    const c = new KeyVertex('C');
    const E = new Directed([a, b]);
    E.t = c;
    expect(E.t).toEqual(c);
  });

  it('should map to a directed hyperedge', () => {
    const a = new KeyVertex('A');
    const b = new KeyVertex('B');
    const E = new Directed([a, b]);
    const D = E.toDirectedHyperedge();
    expect(D instanceof DirectedHyperedge).toBe(true);
    expect(D.h).toEqual([a]);
    expect(D.t).toEqual([b]);
  });

  it('should map to an undirected edge', () => {
    const a = new KeyVertex('A');
    const b = new KeyVertex('B');
    const E = new Directed([a, b]);
    const D = E.toUndirected();
    expect(D instanceof Undirected).toBe(true);
    expect(D.x).toEqual(a);
    expect(D.y).toEqual(b);
  });
});

describe('UndirectedHyperedge', () => {
  it('should return the size of the edge', () => {
    const labels = ['A', 'B', 'C', 'D'];
    const nodes = labels.map((x) => new KeyVertex(x));
    const E = new UndirectedHyperedge(nodes);
    expect(E.size).toEqual(4);
  });
});

describe('DirectedHyperEdge should', () => {
  /*
   * ┌─┐  ┌─┐
   * │A│  │C│
   * │ │->│ │ 
   * │B│  │D│
   * └─┘  └─┘
   */
  it('should return the size of the edge', () => {
    const labels = ['A', 'B', 'C', 'D'];
    const nodes = labels.map((x) => new KeyVertex(x));
    const E = new DirectedHyperedge(nodes.slice(0,2), nodes.slice(2,4));
    expect(E.size).toEqual(4);
  });
  
  it('should return the head set with the h morpism', () => {
    const labels = ['A', 'B', 'C', 'D'];
    const nodes = labels.map((x) => new KeyVertex(x));
    const E = new DirectedHyperedge(nodes.slice(0,2), nodes.slice(2,4));
    expect(E.h).toEqual(nodes.slice(0,2));
  });

  /*
   * ┌─┐  ┌─┐    ┌─┐  ┌─┐
   * │A│  │C│    │E│  │C│
   * │ │->│ │ => │ │->│ │ 
   * │B│  │D│    │F│  │D│
   * └─┘  └─┘    └─┘  └─┘
   */
  it('should set the head set with the h setter', () => {
    const labels = ['A', 'B', 'C', 'D','E', 'F'];
    const nodes = labels.map((x) => new KeyVertex(x));
    const E = new DirectedHyperedge(nodes.slice(0,2), nodes.slice(2,4));
    E.h = nodes.slice(4,6);
    expect(E.h).toEqual(nodes.slice(4,6));
  });

  it('should return the target set with the t morphism', () => {
    const labels = ['A', 'B', 'C', 'D'];
    const nodes = labels.map((x) => new KeyVertex(x));
    const E = new DirectedHyperedge(nodes.slice(0,2), nodes.slice(2,4));
    expect(E.t).toEqual(nodes.slice(2,4));
  });

  /*
   * ┌─┐  ┌─┐    ┌─┐  ┌─┐
   * │A│  │C│    │A│  │E│
   * │ │->│ │ => │ │->│ │ 
   * │B│  │D│    │B│  │F│
   * └─┘  └─┘    └─┘  └─┘
   */
  it('should set the target set with the t setter', () => {
    const labels = ['A', 'B', 'C', 'D','E', 'F'];
    const nodes = labels.map((x) => new KeyVertex(x));
    const E = new DirectedHyperedge(nodes.slice(0,2), nodes.slice(2,4));
    E.t = nodes.slice(4,6);
    expect(E.t).toEqual(nodes.slice(4,6));
  });
});