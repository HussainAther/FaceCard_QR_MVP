import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../components/Screen'; import { Button } from '../components/Button'; import { PrivacyNote } from '../components/PrivacyNote'; import { colors, radius } from '../theme'; import type { RootStackParamList } from '../navigation/types'; import type { EnrollmentImage } from '../models'; import { useState } from 'react';

export function EnrollmentScreen({navigation}: NativeStackScreenProps<RootStackParamList, 'Enrollment'>) {
  const [images, setImages] = useState<EnrollmentImage[]>([]);
  const addLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({mediaTypes: ['images'], allowsMultipleSelection: true, selectionLimit: 5 - images.length, quality: .9, exif: false});
    if (!result.canceled) setImages((current) => [...current, ...result.assets.map(({uri, width, height}) => ({uri, width, height}))].slice(0, 5));
  };
  const takeSelfie = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return Alert.alert('Camera permission needed', 'Enable camera access to take an enrollment selfie, or choose photos instead.');
    const result = await ImagePicker.launchCameraAsync({cameraType: ImagePicker.CameraType.front, quality: .9, allowsEditing: false, exif: false});
    if (!result.canceled) { const {uri, width, height} = result.assets[0]!; setImages((current) => [...current, {uri, width, height}].slice(0, 5)); }
  };
  return <Screen><Text style={styles.title}>Enroll only yourself.</Text><Text style={styles.lead}>Add 3–5 clear, front-facing photos. Use a little variation in expression or angle.</Text>
    <View style={styles.grid}>{Array.from({length: 5}, (_, index) => { const image = images[index]; return <Pressable key={index} onPress={() => image && setImages(images.filter((_, i) => i !== index))} style={[styles.slot, image && styles.filled]}>
      {image ? <><Image source={{uri: image.uri}} style={styles.image}/><View style={styles.check}><Text style={styles.checkText}>✓</Text></View></> : <><Text style={styles.plus}>+</Text><Text style={styles.slotLabel}>Photo {index + 1}</Text></>}
    </Pressable>; })}</View>
    <View style={styles.actions}><Button label="Take selfie" variant="secondary" onPress={takeSelfie} style={styles.action}/><Button label="Choose photos" variant="secondary" onPress={addLibrary} style={styles.action}/></View>
    <PrivacyNote>Validation checks for exactly one detectable face, face size, pose, usable landmarks, and exact duplicate files. Selected image paths are not retained after enrollment.</PrivacyNote>
    <Button label={`Continue with ${images.length} photo${images.length === 1 ? '' : 's'}`} disabled={images.length < 3} onPress={() => navigation.navigate('GenerateIdentity', {images})}/>
  </Screen>;
}
const styles = StyleSheet.create({title: {fontSize: 34, fontWeight: '700', color: colors.ink, marginTop: 12}, lead: {fontSize: 16, lineHeight: 24, color: colors.muted}, grid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10}, slot: {width: '31%', aspectRatio: .82, borderWidth: 1, borderColor: colors.line, borderStyle: 'dashed', borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: colors.white}, filled: {borderStyle: 'solid'}, image: {width: '100%', height: '100%'}, check: {position: 'absolute', right: 7, top: 7, width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.green}, checkText: {color: colors.white, fontWeight: '800'}, plus: {fontSize: 24, color: colors.muted}, slotLabel: {fontSize: 12, color: colors.muted, marginTop: 4}, actions: {flexDirection: 'row', gap: 10}, action: {flex: 1},});
