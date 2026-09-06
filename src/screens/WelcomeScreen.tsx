import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../components/Screen'; import { Button } from '../components/Button'; import { colors } from '../theme'; import type { RootStackParamList } from '../navigation/types';

export function WelcomeScreen({navigation}: NativeStackScreenProps<RootStackParamList, 'Welcome'>) {
  return <Screen contentStyle={styles.screen}><View style={styles.mark}><View style={styles.qrMini}/><View style={styles.qrMini}/><View style={styles.qrMini}/></View>
    <View style={styles.copy}><Text style={styles.eyebrow}>FACECARD QR</Text><Text style={styles.title}>Your identity,{`\n`}yours to share.</Text><Text style={styles.body}>Create a personal QR contact card without maintaining a public social profile.</Text></View>
    <Button label="Create my FaceCard" onPress={() => navigation.navigate('Privacy')}/>
    <Text style={styles.foot}>No account · No feed · No face search</Text>
  </Screen>;
}
const styles = StyleSheet.create({screen: {flexGrow: 1, justifyContent: 'space-between', paddingTop: 70, paddingBottom: 28}, mark: {width: 74, height: 74, borderWidth: 8, borderColor: colors.ink, padding: 7, flexDirection: 'row', gap: 3, flexWrap: 'wrap'}, qrMini: {width: 13, height: 13, backgroundColor: colors.ink}, copy: {gap: 16}, eyebrow: {fontSize: 12, letterSpacing: 2, fontWeight: '800', color: colors.green}, title: {fontSize: 46, lineHeight: 49, letterSpacing: -1.8, fontWeight: '700', color: colors.ink}, body: {fontSize: 18, lineHeight: 27, color: colors.muted, maxWidth: 340}, foot: {textAlign: 'center', fontSize: 13, color: colors.muted}});
