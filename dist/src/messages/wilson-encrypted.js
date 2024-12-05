"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecureCommunicationNetwork = void 0;
class SecureCommunicationNetwork {
    constructor(graph) {
        this.graph = graph;
        this.nodeKeys = new Map();
        // Initialize keys for all nodes
        this.graph.nodes.forEach(node => {
            const keys = this.generateRSAKeys();
            this.nodeKeys.set(node.id, {
                id: node.id,
                publicKey: keys.publicKey,
                privateKey: keys.privateKey
            });
        });
    }
    findPath(fromId, toId) {
        const visited = new Set();
        const queue = [{ id: fromId, path: [fromId] }];
        while (queue.length > 0) {
            const { id, path } = queue.shift();
            if (id === toId) {
                return path;
            }
            if (!visited.has(id)) {
                visited.add(id);
                const neighbors = this.getNeighborIds(id);
                for (const neighborId of neighbors) {
                    if (!visited.has(neighborId)) {
                        queue.push({
                            id: neighborId,
                            path: [...path, neighborId]
                        });
                    }
                }
            }
        }
        return [];
    }
    getNeighborIds(nodeId) {
        return this.graph.edges
            .filter(edge => edge.from === nodeId)
            .map(edge => edge.to);
    }
    sendMessage(message) {
        const senderKeys = this.nodeKeys.get(message.from);
        const receiverKeys = this.nodeKeys.get(message.to);
        if (!senderKeys || !receiverKeys) {
            return null;
        }
        // Verify path exists
        const path = this.findPath(message.from, message.to);
        if (path.length === 0) {
            return null;
        }
        // Encrypt message using receiver's public key
        const encryptedContent = this.encrypt(message.content, receiverKeys.publicKey);
        return {
            ...message,
            metadata: {
                encryptedContent
            }
        };
    }
    receiveMessage(message) {
        const receiverKeys = this.nodeKeys.get(message.to);
        if (!receiverKeys || !message.metadata.encryptedContent) {
            return null;
        }
        return this.decrypt(message.metadata.encryptedContent, receiverKeys.privateKey);
    }
    generateRSAKeys(keySize = 8) {
        const isPrime = (n) => {
            if (n < 2)
                return false;
            for (let i = 2; i <= Math.sqrt(n); i++) {
                if (n % i === 0)
                    return false;
            }
            return true;
        };
        // Generate prime numbers
        const primeRange = Array.from({ length: 2 ** keySize - 2 ** (keySize - 1) }, (_, i) => i + 2 ** (keySize - 1));
        const primes = primeRange.filter(isPrime);
        const p = BigInt(primes[Math.floor(Math.random() * primes.length)]);
        const q = BigInt(primes[Math.floor(Math.random() * primes.length)]);
        const n = p * q;
        const phi = (p - BigInt(1)) * (q - BigInt(1));
        let e = BigInt(65537);
        const modInverse = (a, m) => {
            const extendedGCD = (a, b) => {
                if (b === 0n)
                    return [a, 1n, 0n];
                const [gcd, x1, y1] = extendedGCD(b, a % b);
                return [gcd, y1, x1 - (a / b) * y1];
            };
            const [_, x] = extendedGCD(a, m);
            return ((x % m) + m) % m;
        };
        const d = modInverse(e, phi);
        return {
            publicKey: { e, n },
            privateKey: { d, n }
        };
    }
    encrypt(message, publicKey) {
        return Array.from(message).map(char => {
            const m = BigInt(char.charCodeAt(0));
            return this.modPow(m, publicKey.e, publicKey.n);
        });
    }
    decrypt(encryptedMessage, privateKey) {
        return encryptedMessage
            .map(char => String.fromCharCode(Number(this.modPow(char, privateKey.d, privateKey.n))))
            .join('');
    }
    modPow(base, exponent, modulus) {
        let result = 1n;
        base = base % modulus;
        while (exponent > 0n) {
            if (exponent % 2n === 1n) {
                result = (result * base) % modulus;
            }
            base = (base * base) % modulus;
            exponent = exponent / 2n;
        }
        return result;
    }
    // Helper method to demonstrate the network
    demonstrateSecureCommunication(fromId, toId, message) {
        console.log(`Attempting to send message from ${fromId} to ${toId}`);
        const secureMessage = {
            from: fromId,
            to: toId,
            metadata: {},
            content: message
        };
        const encrypted = this.sendMessage(secureMessage);
        if (encrypted) {
            console.log('Message encrypted successfully');
            const decrypted = this.receiveMessage(encrypted);
            if (decrypted) {
                console.log('Message decrypted successfully');
                console.log('Original message:', message);
                console.log('Decrypted message:', decrypted);
            }
        }
    }
}
exports.SecureCommunicationNetwork = SecureCommunicationNetwork;
// Example usage with the provided graph structure
function demo(graph) {
    const network = new SecureCommunicationNetwork(graph);
    // Test message from Bill (1) to Annie (4)
    network.demonstrateSecureCommunication('1', '4', 'Hello Annie, this is a secure message from Bill!');
}
