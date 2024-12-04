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
        { from: '1', to: '2', message: 'Hello from Bill to John' },
        { from: '2', to: '1', message: 'Hello from John to Bill' },
        { from: '1', to: '3', message: 'Message from Bill to Ezra' },
        { from: '1', to: '5', message: 'Message from Bill to Michelle' },
        { from: '2', to: '3', message: 'Message from John to Ezra' },
        { from: '2', to: '4', message: 'Message from John to Annie' },
        { from: '3', to: '1', message: 'Message from Ezra to Bill' },
        { from: '3', to: '4', message: 'Message from Ezra to Annie' },
        { from: '3', to: '5', message: 'Message from Ezra to Michelle' },
        { from: '4', to: '2', message: 'Message from Annie to John' },
        { from: '4', to: '3', message: 'Message from Annie to Ezra' },
        { from: '4', to: '5', message: 'Message from Annie to Michelle' },
        { from: '5', to: '1', message: 'Message from Michelle to Bill' },
        { from: '5', to: '2', message: 'Message from Michelle to John' },
        { from: '5', to: '3', message: 'Message from Michelle to Ezra' },
        { from: '5', to: '4', message: 'Message from Michelle to Annie' },
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
