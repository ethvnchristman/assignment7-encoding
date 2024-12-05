 "use strict";

import { Graph } from 'graph-data-structure';

// Types and interfaces
interface PublicKey {
  e: bigint;
  n: bigint;
}

interface PrivateKey {
  d: bigint;
  n: bigint;
}

interface Person {
  id: string;
  publicKey: PublicKey;
  privateKey: PrivateKey;
  connections: Set<string>;
}

interface Message {
  senderId: string;
  receiverId: string;
  metadata: Record<string, any>;
  body: string;
}

interface EncryptedMessage extends Message {
  metadata: {
    encryptedBody: bigint[];
  };
}

class SecureCommunicationNetwork {
  private people: Map<string, Person>;
  private graph: Graph;

  constructor() {
    this.people = new Map();
    this.graph = new Graph();
  }

  public addPerson(personId: string): void {
    const keys = this.generateRSAKeys();
    const person: Person = {
      id: personId,
      publicKey: keys.publicKey,
      privateKey: keys.privateKey,
      connections: new Set(),
    };
    this.people.set(personId, person);
    this.graph.addNode(personId);
  }

  public addConnection(person1Id: string, person2Id: string): void {
    const person1 = this.people.get(person1Id);
    const person2 = this.people.get(person2Id);

    if (!person1 || !person2) {
      throw new Error('Both people must exist in the network');
    }

    person1.connections.add(person2Id);
    person2.connections.add(person1Id);
    this.graph.addEdge(person1Id, person2Id);
  }

  public sendMessage(message: Message): EncryptedMessage | null {
    const sender = this.people.get(message.senderId);
    const receiver = this.people.get(message.receiverId);

    if (!sender || !receiver) {
      return null;
    }

    try {
      // Check if there's a path between sender and receiver
      this.graph.shortestPath(message.senderId, message.receiverId);
    } catch {
      return null;
    }

    // Encrypt message using receiver's public key
    const encryptedBody = this.encrypt(message.body, receiver.publicKey);
    
    return {
      ...message,
      metadata: {
        encryptedBody,
      },
    };
  }

  public receiveMessage(message: EncryptedMessage): string | null {
    const receiver = this.people.get(message.receiverId);

    if (!receiver || !message.metadata.encryptedBody) {
      return null;
    }

    return this.decrypt(message.metadata.encryptedBody, receiver.privateKey);
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
    const phi = (p - 1n) * (q - 1n);
    
    // Choose public exponent e
    let e = 65537n;
    
    // Calculate private exponent d using extended Euclidean algorithm
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
      privateKey: { d, n },
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
}

// Example usage
function demoSecureCommunication() {
  const network = new SecureCommunicationNetwork();

  // Add people to the network
  network.addPerson('Alice');
  network.addPerson('Bob');
  network.addPerson('Charlie');

  // Create connections
  network.addConnection('Alice', 'Bob');
  network.addConnection('Bob', 'Charlie');

  // Create and send a message
  const message: Message = {
    senderId: 'Alice',
    receiverId: 'Charlie',
    metadata: {},
    body: 'Hello, this is a secret message!',
  };

  const encryptedMessage = network.sendMessage(message);
  if (encryptedMessage) {
    const decryptedMessage = network.receiveMessage(encryptedMessage);
    console.log('Decrypted message:', decryptedMessage);
  }
}

export { SecureCommunicationNetwork, type Message, type EncryptedMessage };
