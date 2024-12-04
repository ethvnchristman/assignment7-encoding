"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressMessage = compressMessage;
exports.compressGraphData = compressGraphData;
// Basic simulation of lossy compression on strings
function compressMessage(message, retainRatio) {
    // A simple "lossy compression" for demonstration (truncating part of the message)
    const maxLength = Math.floor(message.length * retainRatio);
    return message.slice(0, maxLength);
}
function compressGraphData(graph, retainRatio) {
    const compressedEdges = graph.edges.map((edge) => (Object.assign(Object.assign({}, edge), { message: compressMessage(edge.message, retainRatio) })));
    return Object.assign(Object.assign({}, graph), { edges: compressedEdges });
}
