// src/graph/graph.ts
export interface Node {
    id: string;
    name: string;
  }
  
  export interface Graph {
    nodes: Node[];
    edges: { from: string; to: string }[];
  }
  
  // Example graph data
  export const sampleGraph: Graph = {
    nodes: [
      { id: '1', name: 'Bill' },
      { id: '2', name: 'John' },
      { id: '3', name: 'Ezra' },
      { id: '4', name: 'Annie' },
      { id: '5', name: 'Michelle' },
    ],
    edges: [
      { from: '1', to: '2' },
      { from: '2', to: '1' },
      { from: '1', to: '3' },
      { from: '1', to: '5' },
      { from: '2', to: '3' },
      { from: '2', to: '4' },
      { from: '3', to: '1' },
      { from: '3', to: '4' },
      { from: '3', to: '5' },
      { from: '4', to: '2' },
      { from: '4', to: '3' },
      { from: '4', to: '5' },
      { from: '5', to: '1' },
      { from: '5', to: '2' },
      { from: '5', to: '3' },
      { from: '5', to: '4' },
    ],
  };
  
  export function getNodeById(graph: Graph, id: string): Node | undefined {
    return graph.nodes.find(node => node.id === id);
  }
  
  export function getNeighbors(graph: Graph, nodeId: string): Node[] {
    const neighbors = graph.edges
      .filter(edge => edge.from === nodeId)
      .map(edge => getNodeById(graph, edge.to))
      .filter(node => node !== undefined);
    return neighbors as Node[];
  }
  