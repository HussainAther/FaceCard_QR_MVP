jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('expo-crypto', () => ({
  CryptoDigestAlgorithm: {SHA256: 'SHA-256'},
  digestStringAsync: async (_algorithm, value) => require('crypto').createHash('sha256').update(value).digest('hex'),
}));
