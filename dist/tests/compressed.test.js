"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tests/compressed.test.ts
const graph_1 = require("../src/graph/graph");
const ashton_compressed_1 = require("../src/messages/ashton-compressed");
describe('Ashton Compressed Message Tests', () => {
    let graph;
    beforeEach(() => {
        // Clone the sample graph to ensure a fresh instance for each test
        graph = JSON.parse(JSON.stringify(graph_1.sampleGraph));
    });
    test('Run-length encoding and decoding', () => {
        const message = 'aaabbccccd';
        const encoded = (0, ashton_compressed_1.runLengthEncode)(message);
        const decoded = (0, ashton_compressed_1.runLengthDecode)(encoded);
        expect(encoded).toBe('a3b2c4d1');
        expect(decoded).toBe(message);
    });
    test('Send a compressed message and verify edge metadata', () => {
        const from = '1'; // Bill
        const to = '2'; // John
        const message = 'Helloooooo!!';
        (0, ashton_compressed_1.sendCompressedMessage)(graph, from, to, message);
        const edge = graph.edges.find(edge => edge.from === from && edge.to === to);
        expect(edge).toBeDefined();
        expect(edge === null || edge === void 0 ? void 0 : edge.message).toBeTruthy();
        const metadata = JSON.parse(edge.message);
        expect(metadata.type).toBe('RLE');
        expect(metadata.originalLength).toBe(message.length);
        expect((0, ashton_compressed_1.runLengthDecode)(metadata.compressedMessage)).toBe(message);
    });
    test('Create a new edge with a compressed message', () => {
        const from = '3'; // Ezra
        const to = '5'; // Michelle
        const message = 'Wowwww!!';
        (0, ashton_compressed_1.sendCompressedMessage)(graph, from, to, message);
        const edge = graph.edges.find(edge => edge.from === from && edge.to === to);
        expect(edge).toBeDefined();
        expect(edge === null || edge === void 0 ? void 0 : edge.message).toBeTruthy();
        const metadata = JSON.parse(edge.message);
        expect(metadata.type).toBe('RLE');
        expect(metadata.originalLength).toBe(message.length);
        expect((0, ashton_compressed_1.runLengthDecode)(metadata.compressedMessage)).toBe(message);
    });
});
