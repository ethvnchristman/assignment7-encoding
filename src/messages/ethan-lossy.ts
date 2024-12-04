import { Graph, Edge } from '../graph/graph';

// Basic simulation of lossy compression on strings
export function compressMessage(message: string, retainRatio: number): string {
  const originalLength = message.length;
  // A simple "lossy compression" for demonstration (truncating part of the message)
  const maxLength = Math.floor(originalLength * retainRatio);
  const compressedMessage = message.slice(0, maxLength);
  
  // Log the message before and after compression
  console.log(`Original Message: ${message}`);
  console.log(`Compressed Message (retainRatio: ${retainRatio}): ${compressedMessage}`);

  return compressedMessage;
}

export function compressGraphData(graph: Graph, retainRatio: number): Graph {
  const compressedEdges = graph.edges.map((edge: Edge) => ({
    ...edge,
    message: compressMessage(edge.message, retainRatio),
  }));

  return {
    ...graph,
    edges: compressedEdges,
  };
}