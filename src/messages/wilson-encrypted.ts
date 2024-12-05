import { Graph, Node, Edge } from '../graph/graph';

interface PublicKey {
  e: bigint;
  n: bigint;
}

interface PrivateKey {
  d: bigint;
  n: bigint;
}

interface NodeKeys {
  id: string;
  publicKey: PublicKey;
  privateKey: PrivateKey;
}

interface SecureMessage {
  from: string;
  to: string;
  metadata: Record<string, any>;
  content: string;
}

interface EncryptedMessage extends SecureMessage {
  metadata: {
    encryptedContent: bigint[];
  };
}

class SecureCommunicationNetwork {
  private graph: Graph;
  private nodeKeys: Map<string, NodeKeys>;

  constructor(graph: Graph) {
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

  public findPath(fromId: string, toId: string): string[] {
    const visited = new Set<string>();
    const queue: { id: string; path: string[] }[] = [{ id: fromId, path: [fromId] }];
    
    while (queue.length > 0) {
      const { id, path } = queue.shift()!;
      
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

  private getNeighborIds(nodeId: string): string[] {
    return this.graph.edges
      .filter(edge => edge.from === nodeId)
      .map(edge => edge.to);
  }

  public sendMessage(message: SecureMessage): EncryptedMessage | null {
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

  public receiveMessage(message: EncryptedMessage): string | null {
    const receiverKeys = this.nodeKeys.get(message.to);

    if (!receiverKeys || !message.metadata.encryptedContent) {
      return null;
    }

    return this.decrypt(message.metadata.encryptedContent, receiverKeys.privateKey);
  }

  private generateRSAKeys(keySize: number = 8): { publicKey: PublicKey; privateKey: PrivateKey } {
    const isPrime = (n: number): boolean => {
      if (n < 2) return false;
      for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
      }
      return true;
    };

    // Generate prime numbers
    const primeRange = Array.from(
      { length: 2 ** keySize - 2 ** (keySize - 1) },
      (_, i) => i + 2 ** (keySize - 1)
    );
    const primes = primeRange.filter(isPrime);
    
    const p = BigInt(primes[Math.floor(Math.random() * primes.length)]);
    const q = BigInt(primes[Math.floor(Math.random() * primes.length)]);
    
    const n = p * q;
    const phi = (p - BigInt(1)) * (q - BigInt(1));
    
    let e = BigInt(65537);
    
    const modInverse = (a: bigint, m: bigint): bigint => {
      const extendedGCD = (a: bigint, b: bigint): [bigint, bigint, bigint] => {
        if (b === 0n) return [a, 1n, 0n];
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

  private encrypt(message: string, publicKey: PublicKey): bigint[] {
    return Array.from(message).map(char => {
      const m = BigInt(char.charCodeAt(0));
      return this.modPow(m, publicKey.e, publicKey.n);
    });
  }

  private decrypt(encryptedMessage: bigint[], privateKey: PrivateKey): string {
    return encryptedMessage
      .map(char => String.fromCharCode(Number(this.modPow(char, privateKey.d, privateKey.n))))
      .join('');
  }

  private modPow(base: bigint, exponent: bigint, modulus: bigint): bigint {
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
  public demonstrateSecureCommunication(fromId: string, toId: string, message: string): void {
    console.log(`Attempting to send message from ${fromId} to ${toId}`);
    
    const secureMessage: SecureMessage = {
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

// Example usage with the provided graph structure
function demo(graph: Graph) {
  const network = new SecureCommunicationNetwork(graph);
  
  // Test message from Bill (1) to Annie (4)
  network.demonstrateSecureCommunication('1', '4', 'Hello Annie, this is a secure message from Bill!');
}

export { SecureCommunicationNetwork, type SecureMessage, type EncryptedMessage };