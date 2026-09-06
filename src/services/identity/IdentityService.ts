import { File } from 'expo-file-system';
import * as Crypto from 'expo-crypto';
import { RNMLKitFaceDetector, type RNMLKitFace } from '@infinitered/react-native-mlkit-face-detection';
import type { EnrollmentImage, IdentityProfile } from '../../models';
import { averageVectors, createIdentityHash, EMBEDDING_VERSION, normalizeVector, personalIdFromHash } from './identityVector';

const LANDMARK_ORDER = ['leftEye', 'rightEye', 'noseBase', 'leftMouth', 'rightMouth', 'bottomMouth', 'leftCheek', 'rightCheek'] as const;

export interface EnrollmentProgress { step: 'detecting' | 'aligning' | 'creating' | 'hashing' | 'complete'; current: number; total: number }

export class IdentityService {
  private detector = new RNMLKitFaceDetector({performanceMode: 'accurate', landmarkMode: true, contourMode: false, classificationMode: true, minFaceSize: 0.18});

  async enrollFromImages(images: EnrollmentImage[], onProgress?: (progress: EnrollmentProgress) => void): Promise<IdentityProfile> {
    if (images.length < 3 || images.length > 5) throw new Error('Choose between 3 and 5 photos.');
    await this.detector.initialize({performanceMode: 'accurate', landmarkMode: true, contourMode: false, classificationMode: true, minFaceSize: 0.18});
    const fingerprints = new Set<string>();
    const vectors: number[][] = [];
    for (let index = 0; index < images.length; index += 1) {
      const image = images[index]!;
      onProgress?.({step: 'detecting', current: index + 1, total: images.length});
      const base64 = await new File(image.uri).base64();
      const fingerprint = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, base64);
      if (fingerprints.has(fingerprint)) throw new Error(`Photo ${index + 1} duplicates another enrollment photo.`);
      fingerprints.add(fingerprint);
      const result = await this.detector.detectFaces(image.uri);
      if (!result?.success) throw new Error(`Photo ${index + 1} could not be processed.`);
      if (result.faces.length !== 1) throw new Error(`Photo ${index + 1} must contain exactly one clear face.`);
      onProgress?.({step: 'aligning', current: index + 1, total: images.length});
      vectors.push(this.createEmbedding(result.faces[0]!, image));
    }
    onProgress?.({step: 'creating', current: images.length, total: images.length});
    const stableVector = this.createStableIdentityVector(vectors);
    onProgress?.({step: 'hashing', current: images.length, total: images.length});
    const identityHash = await this.createIdentityHash(stableVector);
    onProgress?.({step: 'complete', current: images.length, total: images.length});
    return {id: personalIdFromHash(identityHash), createdAt: new Date().toISOString(), identityHash, embeddingVersion: EMBEDDING_VERSION};
  }

  createEmbedding(face: RNMLKitFace, image: EnrollmentImage): number[] {
    const { origin, size } = face.frame;
    if (size.x * size.y < image.width * image.height * 0.12) throw new Error('Move closer so your face fills more of the photo.');
    if (Math.abs(face.headEulerAngleY ?? 0) > 28 || Math.abs(face.headEulerAngleX ?? 0) > 28) throw new Error('Use a front-facing photo with less head tilt.');
    const byType = new Map(face.landmarks.map((landmark) => [landmark.type, landmark.position]));
    const vector: number[] = [];
    for (const type of LANDMARK_ORDER) {
      const point = byType.get(type);
      if (!point) throw new Error('Face details are unclear. Try brighter, even lighting.');
      vector.push((point.x - origin.x) / size.x, (point.y - origin.y) / size.y);
    }
    return normalizeVector(vector);
  }

  createStableIdentityVector(vectors: number[][]): number[] { return averageVectors(vectors); }
  createIdentityHash(vector: number[]): Promise<string> { return createIdentityHash(vector); }
  async deleteIdentity(): Promise<void> { /* StorageService owns deletion; no photo or model asset is retained here. */ }
}

export const identityService = new IdentityService();
