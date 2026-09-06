import type { FaceCardPayload } from '../models';
export type RootStackParamList = {
  Welcome: undefined; Privacy: undefined; Enrollment: undefined; GenerateIdentity: {images: {uri: string; width: number; height: number}[]};
  Home: undefined; CardEditor: {cardId?: string} | undefined; CardView: {cardId: string}; Scanner: undefined; ScannedCard: {payload: FaceCardPayload}; Paywall: undefined; Settings: undefined;
};
