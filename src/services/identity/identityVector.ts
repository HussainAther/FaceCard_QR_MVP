import * as Crypto from 'expo-crypto';

export const EMBEDDING_VERSION = 'mlkit-landmarks-v1';

export function normalizeVector(values: number[]): number[] {
  const norm = Math.sqrt(values.reduce((sum, value) => sum + value * value, 0));
  if (!Number.isFinite(norm) || norm === 0) throw new Error('Could not create a stable visual descriptor.');
  return values.map((value) => value / norm);
}

export function averageVectors(vectors: number[][]): number[] {
  if (vectors.length < 3) throw new Error('At least three usable photos are required.');
  const length = vectors[0]?.length ?? 0;
  if (!length || vectors.some((vector) => vector.length !== length)) throw new Error('Visual descriptors are inconsistent.');
  return normalizeVector(Array.from({ length }, (_, index) =>
    vectors.reduce((sum, vector) => sum + (vector[index] ?? 0), 0) / vectors.length,
  ));
}

export function canonicalizeVector(vector: number[]): string {
  return normalizeVector(vector).map((value) => Math.round(value * 10_000)).join(',');
}

export async function createIdentityHash(vector: number[]): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${EMBEDDING_VERSION}:${canonicalizeVector(vector)}`);
}

export function personalIdFromHash(hash: string): string { return hash.slice(0, 32); }
