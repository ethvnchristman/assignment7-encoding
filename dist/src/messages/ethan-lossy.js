"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressMessage = compressMessage;
exports.compressGraphData = compressGraphData;
// Basic simulation of lossy compression on strings
function compressMessage(message, retainRatio) {
    const originalLength = message.length;
    // A simple "lossy compression" for demonstration (truncating part of the message)
    const maxLength = Math.floor(originalLength * retainRatio);
    const compressedMessage = message.slice(0, maxLength);
    // Log the message before and after compression
    console.log(`Original Message: ${message}`);
    console.log(`Compressed Message (retainRatio: ${retainRatio}): ${compressedMessage}`);
    return compressedMessage;
}
function compressGraphData(graph, retainRatio) {
    const compressedEdges = graph.edges.map((edge) => ({
        ...edge,
        message: compressMessage(edge.message, retainRatio),
    }));
    return {
        ...graph,
        edges: compressedEdges,
    };
}
