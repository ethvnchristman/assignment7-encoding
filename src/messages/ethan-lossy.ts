import { fft, ifft } from 'fft-js';

export interface CompressedMessage {
  sender: string;
  receiver: string;
  metadata: {
    originalLength: number;
    lossiness: number;
  };
  messageBody: string;
}

/**
 * Compresses a message using lossy FFT-based compression.
 * @param sender - The sender's ID.
 * @param receiver - The receiver's ID.
 * @param message - The message string to be compressed.
 * @param lossiness - A number between 0 and 1 specifying how much detail to discard.
 * @returns A compressed message object.
 */
export function lossyCompress(
  sender: string,
  receiver: string,
  message: string,
  lossiness: number
): CompressedMessage {
  if (lossiness < 0 || lossiness > 1) {
    throw new Error("Lossiness must be between 0 and 1.");
  }

  const originalLength = message.length;

  // Convert message to ASCII array
  const data = Array.from(message).map((char) => char.charCodeAt(0));

  // Perform FFT
  const transformed = fft(data);

  // Apply lossy compression by discarding high frequencies
  const compressed = transformed.map((value: any, index: number) => {
    const threshold = Math.floor(lossiness * transformed.length);
    return index >= threshold ? [0, 0] : value;
  });

  // Perform IFFT to reconstruct the compressed data
  const reconstructed = ifft(compressed).map((val: [number, number]) => Math.round(val[0]));

  // Convert reconstructed data back to a string
  const compressedMessage = reconstructed
    .map((num: number) => String.fromCharCode(num))
    .join("");

  return {
    sender,
    receiver,
    metadata: {
      originalLength,
      lossiness,
    },
    messageBody: compressedMessage,
  };
}
