"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runLengthEncode = runLengthEncode;
exports.runLengthDecode = runLengthDecode;
exports.sendCompressedMessage = sendCompressedMessage;
/**
 * Encodes a message using run-length encoding (RLE).
 * @param message The message to encode.
 * @returns The run-length encoded message.
 */
function runLengthEncode(message) {
    let encoded = '';
    let count = 1;
    for (let i = 1; i <= message.length; i++) {
        if (message[i] === message[i - 1]) {
            count++;
        }
        else {
            encoded += message[i - 1] + count;
            count = 1;
        }
    }
    return encoded;
}
/**
 * Decodes a run-length encoded message.
 * @param encoded The run-length encoded message.
 * @returns The original decoded message.
 */
function runLengthDecode(encoded) {
    let decoded = '';
    let i = 0;
    while (i < encoded.length) {
        const char = encoded[i];
        let count = '';
        i++;
        while (i < encoded.length && !isNaN(Number(encoded[i]))) {
            count += encoded[i];
            i++;
        }
        decoded += char.repeat(Number(count));
    }
    return decoded;
}
/**
 * Sends a compressed message using run-length encoding.
 * Updates the graph with metadata about the compressed message.
 * @param graph The graph to update.
 * @param from The ID of the sender node.
 * @param to The ID of the receiver node.
 * @param message The message to send.
 */
function sendCompressedMessage(graph, from, to, message) {
    const encodedMessage = runLengthEncode(message);
    // Metadata about the compressed message
    const metadata = JSON.stringify({
        type: 'RLE',
        originalLength: message.length,
        compressedMessage: encodedMessage,
    });
    // Check if an edge exists and update it, otherwise create a new edge
    const edgeIndex = graph.edges.findIndex(edge => edge.from === from && edge.to === to);
    if (edgeIndex !== -1) {
        graph.edges[edgeIndex].message = metadata;
    }
    else {
        graph.edges.push({ from, to, message: metadata });
    }
}
