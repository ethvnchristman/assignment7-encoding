"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethan_lossy_1 = require("../src/messages/ethan-lossy");
const graph_1 = require("../src/graph/graph");
describe('Lossy Compression Tests', () => {
    test('Should compress a message with minimal lossiness', () => {
        const compressedGraph = (0, ethan_lossy_1.compressGraphData)(graph_1.sampleGraph, 0.8); // 80% of the messages retained
        const originalMessage = graph_1.sampleGraph.edges[0].message;
        const compressedMessage = compressedGraph.edges[0].message;
        expect(compressedMessage).not.toBe(originalMessage); // The compressed message should be different
    });
    test('Should compress a message with more lossiness', () => {
        const compressedGraph = (0, ethan_lossy_1.compressGraphData)(graph_1.sampleGraph, 0.2); // 20% of the messages retained
        const originalMessage = graph_1.sampleGraph.edges[0].message;
        const compressedMessage = compressedGraph.edges[0].message;
        expect(compressedMessage).not.toBe(originalMessage); // The compressed message should be different
    });
    test('Should compress and reconstruct a message with minimal loss', () => {
        const compressedGraph = (0, ethan_lossy_1.compressGraphData)(graph_1.sampleGraph, 1); // No lossiness, no change
        const originalMessage = graph_1.sampleGraph.edges[0].message;
        const compressedMessage = compressedGraph.edges[0].message;
        expect(compressedMessage).toBe(originalMessage); // The compressed message should be the same as the original
    });
    test('Should return a graph with compressed messages', () => {
        const compressedGraph = (0, ethan_lossy_1.compressGraphData)(graph_1.sampleGraph, 0.5); // 50% of the messages retained
        compressedGraph.edges.forEach((edge, index) => {
            const originalMessage = graph_1.sampleGraph.edges[index].message;
            expect(edge.message.length).toBeLessThanOrEqual(originalMessage.length);
        });
    });
});
