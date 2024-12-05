// tests/compressed.test.ts
import { Graph, sampleGraph } from '../src/graph/graph';
import { sendCompressedMessage, runLengthEncode, runLengthDecode } from '../src/messages/ashton-compressed';

describe('Ashton Compressed Message Tests', () => {
  let graph: Graph;

  beforeEach(() => {
    // Clone the sample graph to ensure a fresh instance for each test
    graph = JSON.parse(JSON.stringify(sampleGraph));
  });

  test('Run-length encoding and decoding', () => {
    const message = 'aaabbccccd';
    const encoded = runLengthEncode(message);
    const decoded = runLengthDecode(encoded);

    expect(encoded).toBe('a3b2c4d1');
    expect(decoded).toBe(message);
  });

  test('Send a compressed message and verify edge metadata', () => {
    const from = '1'; // Bill
    const to = '2';   // John
    const message = 'Helloooooo!!';

    sendCompressedMessage(graph, from, to, message);

    const edge = graph.edges.find(edge => edge.from === from && edge.to === to);
    expect(edge).toBeDefined();
    expect(edge?.message).toBeTruthy();

    const metadata = JSON.parse(edge!.message);
    expect(metadata.type).toBe('RLE');
    expect(metadata.originalLength).toBe(message.length);
    expect(runLengthDecode(metadata.compressedMessage)).toBe(message);
  });

  test('Create a new edge with a compressed message', () => {
    const from = '3'; // Ezra
    const to = '5';   // Michelle
    const message = 'Wowwww!!';

    sendCompressedMessage(graph, from, to, message);

    const edge = graph.edges.find(edge => edge.from === from && edge.to === to);
    expect(edge).toBeDefined();
    expect(edge?.message).toBeTruthy();

    const metadata = JSON.parse(edge!.message);
    expect(metadata.type).toBe('RLE');
    expect(metadata.originalLength).toBe(message.length);
    expect(runLengthDecode(metadata.compressedMessage)).toBe(message);
  });
});
