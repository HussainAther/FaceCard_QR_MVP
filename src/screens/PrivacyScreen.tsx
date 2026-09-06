import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../components/Screen'; import { Button } from '../components/Button'; import { PrivacyNote } from '../components/PrivacyNote'; import { colors } from '../theme'; import type { RootStackParamList } from '../navigation/types'; import { useApp } from '../hooks/useApp';

const points = [
  ['Photos stay on this device', 'Your selected images are processed locally and are never uploaded by FaceCard QR.'],
  ['Face data stays private', 'The local visual descriptor and source photos are never included in your QR.'],
  ['You choose every field', 'Only toggled-on contact information is serialized into a card.'],
  ['Delete means delete', 'Remove your identity and card data from Settings at any time.'],
];
export function PrivacyScreen({navigation}: NativeStackScreenProps<RootStackParamList, 'Privacy'>) {
  const app = useApp();
  const next = async () => { await app.completePrivacyIntro(); navigation.navigate('Enrollment'); };
  return <Screen><Text style={styles.title}>Private by design.</Text><Text style={styles.lead}>FaceCard is an in-person exchange tool—not a social network or a way to identify strangers.</Text>
    <View style={styles.list}>{points.map(([title, body], i) => <View key={title} style={styles.point}><Text style={styles.number}>0{i + 1}</Text><View style={styles.pointCopy}><Text style={styles.pointTitle}>{title}</Text><Text style={styles.body}>{body}</Text></View></View>)}</View>
    <PrivacyNote>Your personal visual identity is derived from your enrolled photos. It is not claimed to be globally unique.</PrivacyNote>
    <Button label="I understand" onPress={next}/>
  </Screen>;
}
const styles = StyleSheet.create({title: {fontSize: 36, fontWeight: '700', color: colors.ink, marginTop: 18}, lead: {fontSize: 17, lineHeight: 25, color: colors.muted}, list: {gap: 4}, point: {flexDirection: 'row', gap: 14, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: colors.line}, number: {fontSize: 12, color: colors.green, fontWeight: '800', paddingTop: 3}, pointCopy: {flex: 1, gap: 4}, pointTitle: {fontSize: 16, fontWeight: '700', color: colors.ink}, body: {fontSize: 14, lineHeight: 20, color: colors.muted}});
