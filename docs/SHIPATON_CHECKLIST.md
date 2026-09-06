# Shipaton and store checklist

The verified event deadline is **September 30, 2026 at 11:45 PM PDT**. The first public app version must release on iOS/iPadOS/macOS/Android during August 1–September 30, use RevenueCat for a purchase, and be brand-new. The student Next Gen path can use a video plus open-source code without a paid store account.

## Required Devpost materials

- [ ] Join the event and confirm territorial eligibility.
- [ ] Public App Store, Google Play, or Galaxy Store URL (unless entering the student Next Gen path).
- [ ] Text description of working features.
- [ ] Public YouTube/Vimeo demo, no more than 2 minutes, running on the target device.
- [ ] 1024×1024 app icon.
- [ ] At least one 1179×2556 screenshot with no device frame.
- [ ] Apple/Google promo code and instructions so judges can unlock the one-time Pro purchase.
- [ ] No unlicensed trademarks, copyrighted music, or third-party material in the demo.

## Recommended screenshot set

Capture all at **1179×2556 px**, portrait, no frame, fictional contact data:

1. Hero card view with a real scannable QR — “Share contact, not a public persona.”
2. Field toggles — “Every detail is your choice.”
3. Enrollment privacy — “Your photos stay on your device.”
4. Received card — “Only shared fields arrive.”
5. Pro contexts/paywall — “One purchase. A card for every context.”

Check the QR after any marketing compositing; never blur, skew, recolor, crop its quiet zone, or overlay artwork.

## Physical-device acceptance matrix

- [ ] iPhone: select 3, 4, and 5 photos; take a selfie; reject 0/2 faces, tiny face, strong pose, duplicate file.
- [ ] Android: same enrollment matrix.
- [ ] iPhone → Android and Android → iPhone QR scans at low/high brightness and 30–100 cm.
- [ ] Untoggled fields are absent by inspecting decoded JSON, not merely hidden in UI.
- [ ] Malformed, huge, `javascript:` URL, unknown-key, wrong-version, and expired QRs fail safely.
- [ ] Save Contact requests permission at action time; denial is recoverable.
- [ ] Share/save image creates a crisp QR; third-party camera apps can scan the saved result.
- [ ] Sandbox purchase success, cancellation, network failure, repeated tap, app restart, and restore.
- [ ] Free users cannot create card two, enable Pro field/theme, or high-resolution export.
- [ ] Pro remains active after restart and restore.
- [ ] Delete Identity removes secure metadata and tied cards.
- [ ] Delete All returns to first launch; RevenueCat store history remains restorable.
- [ ] VoiceOver/TalkBack reads buttons, fields, toggles, and scanner permission state.

## Store readiness

- [ ] Replace `[INSERT ...]` placeholders in `PRIVACY_POLICY.md`; publish stable HTTPS URL.
- [ ] Confirm legal developer/support URLs and support email.
- [ ] Complete Apple privacy nutrition labels and Google Play Data safety from the production binary.
- [ ] Disclose RevenueCat purchase data and ML Kit dependency behavior accurately.
- [ ] Review current Apple App Review Guidelines and Google Play user-data/biometric policies.
- [ ] Complete export compliance, content rating, and encryption questionnaires.
- [ ] Validate iPad layout or disable iPad support intentionally.
- [ ] Set production keys and `EXPO_PUBLIC_REVENUECAT_MOCK=false`.
- [ ] Confirm product `facecard_pro_lifetime`, entitlement `pro`, and current lifetime offering on both platforms.
- [ ] Upload translated IAP/store metadata and screenshots where required.
- [ ] Submit early enough for review and release before the event deadline.

## Final commands

```bash
npm ci
npm test
npm run typecheck
npm run doctor
npx expo prebuild --clean
eas build --platform all --profile production
```

Sources: [Shipaton requirements](https://revenuecat-shipaton-2026.devpost.com/), [RevenueCat Expo guide](https://www.revenuecat.com/docs/getting-started/installation/expo), [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/).
