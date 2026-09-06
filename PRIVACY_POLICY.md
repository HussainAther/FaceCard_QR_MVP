# FaceCard QR Privacy Policy — Draft

**Effective date:** [INSERT DATE]  
**Developer:** [INSERT LEGAL NAME / ENTITY]  
**Contact:** [INSERT PRIVACY EMAIL]  
**Public URL:** [INSERT HOSTED POLICY URL]

FaceCard QR is designed for intentional, in-person contact exchange. It does not provide public profiles, social discovery, face search, or stranger identification.

## Information processed

### Enrollment photos and face-derived data

You may take or select three to five photos for self-enrollment. FaceCard QR processes those images on your device to detect one face, validate image usability, and calculate a local visual descriptor. The descriptor is averaged and transformed with SHA-256 into a personal visual identity hash.

FaceCard QR does not upload enrollment photos, detected landmarks, or visual descriptors. It does not include them in QR codes. The app does not persist selected image paths or the intermediate descriptor. Photos you selected from your library remain under your control in that library; photos and temporary copies may also be subject to operating-system cache behavior.

The resulting identifier is not guaranteed to be globally unique and must not be used as authentication or proof of legal identity.

### Contact-card information

You may enter a display name, email, phone, website, LinkedIn, GitHub, company, job title, and note. Card configuration is stored locally. A generated QR contains only the fields whose switches you enable, together with a payload version/type and shortened local identity identifier. Anyone you show or send the QR to can read and retain its contents.

### Purchases

Apple or Google processes payments. RevenueCat processes purchase status and an app/store customer identifier so FaceCard QR can unlock and restore Pro. The app does not send your enrollment photos, visual descriptor, identity hash, contact fields, or scanned QR contents to RevenueCat. Apple, Google, and RevenueCat process information under their own policies.

### Device permissions

- **Camera:** scan a QR or take an enrollment selfie when you request it.
- **Photos:** select enrollment photos and save a card image when you request it.
- **Contacts:** save a scanned card only after you tap Save Contact.

FaceCard QR does not use these permissions for background surveillance or contact discovery.

## Storage and retention

The identity hash and extractor version are stored using device-protected storage. Contact cards and preferences are stored in the app's local storage. FaceCard QR operates without a developer-run account or profile backend.

You can delete the enrolled identity and its cards, or delete all local app data, from Settings. Deleting the app also removes app-local data, subject to operating-system backup behavior. Store purchase records remain with Apple/Google and may be restored. QR copies already shared and contacts already saved on other devices are not under FaceCard QR's control.

## Sharing and sale

The developer does not sell personal information and does not use FaceCard data for advertising, analytics, profiling, model training, or social discovery. Information is disclosed only through QR cards you intentionally show/share and to purchase processors as described above.

## Children

FaceCard QR is not directed to children under 13. [ADAPT TO YOUR TARGET TERRITORIES AND AGE RATING BEFORE PUBLICATION.]

## Security

The app minimizes stored data, uses protected device storage for identity metadata, and validates scanned payloads. No storage or transmission method is perfectly secure. Protect exported QR images as you would a business card.

## Changes and contact

Material changes will be reflected by updating this policy and its effective date. Questions or deletion concerns may be sent to [INSERT PRIVACY EMAIL].

> Shipping note: This is a product-specific draft, not legal advice. Replace every placeholder, verify the final binary and SDK data practices, publish at a stable public URL, and align App Store privacy labels and Google Play Data safety answers with the tested production build.
