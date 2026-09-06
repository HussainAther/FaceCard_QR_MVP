# FaceCard QR

**Identity without profile performance.** FaceCard QR is a privacy-first iOS and Android contact-exchange MVP for the RevenueCat Shipaton 2026. A user self-enrolls with 3–5 explicitly selected photos, creates a local visual identity, chooses individual contact fields, and shares only those fields through a scannable QR.

There is no account, feed, public directory, social graph, face search, stranger identification, backend, or cloud biometric database.

## What works

- Three-screen privacy onboarding and 3–5 image self-enrollment
- On-device ML Kit face detection and landmark validation
- Deterministic SHA-256 personal ID from an averaged local visual descriptor
- One free contact card with independent name/email/phone/website controls
- Versioned QR generation and native camera scanning
- Strict QR schema, size, URL, and unexpected-property validation
- Save scanned details to Contacts; copy email or open shared URLs
- Basic image export and share sheet
- RevenueCat lifetime Pro purchase, restore, entitlement refresh, errors, and development mock
- Pro gating for multiple cards, extra fields, themes, high-resolution image/PDF export, and configuration backup
- Secure local identity metadata, card persistence, identity deletion, and full local reset

## Architecture

```text
src/
  components/       reusable privacy-forward UI
  hooks/            app state and persistence orchestration
  models/           versioned domain types
  navigation/       typed native stack
  screens/          onboarding, cards, scan, paywall, settings
  services/
    identity/       ML Kit detection → descriptor → SHA-256 ID
    qr/             allowlisted serialization and hostile-input decoding
    revenuecat/     one purchase boundary + pure Pro gates
    storage/        SecureStore + app-local card storage
  utils/
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for data flow and threat boundaries.

## Privacy architecture

1. The image picker exposes only photos the user explicitly selects or captures.
2. Google ML Kit face detection runs locally. Each image must have exactly one face, a sufficiently large face, limited pose, and a minimum set of landmarks.
3. Landmark positions are normalized relative to the detected face box, L2-normalized, averaged across photos, quantized, and hashed with SHA-256.
4. Only the hash, short local ID, creation time, and extractor version are stored in device-protected storage. Source image paths and descriptors are not persisted.
5. QR payloads are built from an allowlist. Untoggled fields, photos, descriptors, and the full hash never enter the QR.
6. The receiving device treats every QR as hostile input and rejects unknown keys, oversized strings/payloads, non-HTTP(S) links, invalid contact values, unsupported versions, and expired cards.

RevenueCat receives its normal anonymous purchase/customer metadata. It does not receive FaceCard identity data, photos, contact fields, or QR contents from this app.

## Biometric limitation — read before shipping

The MVP uses a **normalized ML Kit landmark descriptor**, not a recognition-grade neural face embedding. It provides a deterministic ID for the same processed enrollment set, but it is not suitable for authentication, matching people, or claiming global uniqueness. Re-enrolling from different photos may create a different ID. UI copy deliberately says “Personal visual identity derived from your enrolled photos.”

`IdentityService.createEmbedding()` is the replacement seam for a future bundled MobileFaceNet/TFLite extractor. If replaced, keep inference offline, update `EMBEDDING_VERSION`, never serialize/store raw embeddings unless essential, and re-run the privacy review. Do not silently market the current landmark descriptor as face recognition.

## Local development

Requirements: Node.js 22.13+, Xcode 26.4+ for iOS, or Android Studio/JDK 17 for Android. Expo Go is insufficient for the real native face-detection and purchase paths.

```bash
npm install
cp .env.example .env
npm test
npm run typecheck
npx expo prebuild --clean
npm run dev
```

Build and install a development client:

```bash
eas build --platform ios --profile development
eas build --platform android --profile development
```

For UI work without store setup, leave `EXPO_PUBLIC_REVENUECAT_MOCK=true`. The mock persists a local Pro flag. It must be `false` in store builds. Face detection still requires a development build and physical-device testing.

## RevenueCat production configuration

1. Create one RevenueCat project and add the iOS and Android apps using the exact bundle IDs in `app.json`.
2. In App Store Connect, create a **Non-Consumable** in-app purchase with product ID `facecard_pro_lifetime`.
3. In Play Console, create a one-time product with the same product ID and activate its purchase option.
4. Import both products into RevenueCat.
5. Create entitlement `pro` and attach both store products.
6. Create a current offering and add the products as a lifetime package. The service searches by product identifier, so the package identifier can remain RevenueCat's `$rc_lifetime`.
7. Put each platform's **public SDK key** in `.env`; never put RevenueCat secret API keys in the app.
8. Set `EXPO_PUBLIC_REVENUECAT_MOCK=false`, rebuild the native app, and test purchase/cancel/error/restore with sandbox store accounts.
9. Generate Apple and Google promo codes for judges because this non-consumable has no free trial. Include instructions in the private Devpost submission fields.

The integration is centralized in `src/services/revenuecat/RevenueCatService.ts`; UI components never call the SDK directly.

## Production builds

```bash
eas build --platform all --profile production
eas submit --platform ios --profile production
eas submit --platform android --profile production
```

Before submission, replace placeholder bundle ownership values if needed, run both physical-device matrices in [docs/SHIPATON_CHECKLIST.md](docs/SHIPATON_CHECKLIST.md), publish the privacy policy, configure store privacy disclosures, and confirm `EXPO_PUBLIC_REVENUECAT_MOCK=false` in the exact production archive.

## Verification

```bash
npm test          # 11 unit tests
npm run typecheck
npm run doctor
```

Tests cover deterministic hashing, descriptor averaging, QR round trips, selected-field privacy, malformed/untrusted payloads, entitlement logic, Pro gates, persistence, and identity/all-data deletion.

## Submission materials

- [Privacy policy draft](PRIVACY_POLICY.md)
- [Two-minute demo script](docs/DEMO_SCRIPT.md)
- [Store listing](docs/STORE_LISTING.md)
- [Shipaton and screenshot checklist](docs/SHIPATON_CHECKLIST.md)
- [Technical architecture and threat boundaries](docs/ARCHITECTURE.md)

## Official references

- [RevenueCat Expo setup](https://www.revenuecat.com/docs/getting-started/installation/expo)
- [RevenueCat restore purchases](https://www.revenuecat.com/docs/getting-started/restoring-purchases)
- [Expo SDK 57 reference](https://docs.expo.dev/versions/v57.0.0/)
- [Expo Camera QR scanning](https://docs.expo.dev/versions/v57.0.0/sdk/camera/)
- [Shipaton 2026 requirements](https://revenuecat-shipaton-2026.devpost.com/)

## License

MIT. Third-party SDKs and store services retain their own terms.
