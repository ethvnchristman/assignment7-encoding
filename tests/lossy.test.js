"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethan_lossy_1 = require("../src/messages/ethan-lossy");
describe('Lossy Compression Tests', () => {
    test('Should compress a message with minimal lossiness', () => {
        const message = 'Hello, world!';
        const compressedMessage = (0, ethan_lossy_1.lossyCompress)(message, 0.8); // 80% of the frequencies retained
        expect(compressedMessage).not.toBe(message); // The compressed message should be different
    });
    test('Should compress a message with more lossiness', () => {
        const message = 'Hello, world!';
        const compressedMessage = (0, ethan_lossy_1.lossyCompress)(message, 0.2); // 20% of the frequencies retained
        expect(compressedMessage).not.toBe(message); // The compressed message should be different
    });
    test('Should compress and reconstruct a message with minimal loss', () => {
        const message = 'Hello, world!';
        const compressedMessage = (0, ethan_lossy_1.lossyCompress)(message, 1); // No lossiness, no change
        expect(compressedMessage).toBe(message); // The compressed message should be the same as the original
    });
    test('Should return a string of reasonable length after compression', () => {
        const message = 'A very long message that should be compressed significantly';
        const compressedMessage = (0, ethan_lossy_1.lossyCompress)(message, 0.5); // 50% of the frequencies retained
        expect(compressedMessage.length).toBeLessThan(message.length);
    });
});
