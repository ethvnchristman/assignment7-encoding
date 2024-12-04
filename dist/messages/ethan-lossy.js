"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lossyCompress = lossyCompress;
const fft_js_1 = require("fft-js");
function messageToArray(message) {
    // Convert the message string into an array of numbers (ASCII values)
    return message.split('').map(char => char.charCodeAt(0));
}
function arrayToMessage(arr) {
    // Convert an array of numbers back to a string
    return arr.map(num => String.fromCharCode(num)).join('');
}
// Lossy compression using FFT
function lossyCompress(message, lossiness) {
    const messageArray = messageToArray(message);
    // Perform FFT on the message array (transform it to frequency domain)
    const fftResult = (0, fft_js_1.fft)(messageArray);
    // Apply lossiness: zero out high-frequency components
    const cutoff = Math.floor(fftResult.length * lossiness);
    for (let i = cutoff; i < fftResult.length; i++) {
        fftResult[i] = [0, 0]; // Zero out higher frequencies
    }
    // Perform inverse FFT to get the "blurry" compressed message
    const compressedArray = (0, fft_js_1.ifft)(fftResult);
    // Convert the compressed array back to a string (round values to avoid non-ASCII characters)
    return arrayToMessage(compressedArray.map((num) => Math.round(num[0])));
}
