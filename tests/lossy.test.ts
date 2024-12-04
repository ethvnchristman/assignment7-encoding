import { lossyCompress } from '../src/messages/ethan-lossy.ts';

test('Lossy compression reduces message size', () => {
  const message = "Hello, this is a test message.";
  const result = lossyCompress("Alice", "Bob", message, 0.5);

  expect(result.metadata.originalLength).toBe(message.length);
  expect(result.metadata.lossiness).toBe(0.5);
  expect(result.messageBody.length).toBeLessThanOrEqual(message.length);
});

test('Lossy compression with 0% lossiness retains original message', () => {
  const message = "Hello, World!";
  const result = lossyCompress("Alice", "Bob", message, 0);

  expect(result.messageBody).toBe(message);
});

test('Lossy compression with 100% lossiness removes all data', () => {
  const message = "Hello, World!";
  const result = lossyCompress("Alice", "Bob", message, 1);

  expect(result.messageBody.trim()).toBe("");
});

test('Lossiness out of bounds throws error', () => {
  expect(() => lossyCompress("Alice", "Bob", "Test", -0.1)).toThrow();
  expect(() => lossyCompress("Alice", "Bob", "Test", 1.1)).toThrow();
});
