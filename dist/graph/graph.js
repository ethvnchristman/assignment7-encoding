"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sampleGraph = void 0;
exports.getNodeById = getNodeById;
exports.getNeighbors = getNeighbors;
// Example graph data
exports.sampleGraph = {
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
function getNodeById(graph, id) {
    return graph.nodes.find(node => node.id === id);
}
function getNeighbors(graph, nodeId) {
    const neighbors = graph.edges
        .filter(edge => edge.from === nodeId)
        .map(edge => getNodeById(graph, edge.to))
        .filter(node => node !== undefined);
    return neighbors;
}
