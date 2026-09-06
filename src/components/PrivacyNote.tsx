import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme';
export function PrivacyNote({children}: {children: string}) { return <View style={styles.box}><Text style={styles.lock}>●</Text><Text style={styles.text}>{children}</Text></View>; }
const styles = StyleSheet.create({box: {flexDirection: 'row', gap: 10, borderRadius: radius.md, backgroundColor: colors.greenSoft, padding: 14}, lock: {color: colors.green, fontSize: 10, paddingTop: 4}, text: {flex: 1, color: '#244B39', lineHeight: 20, fontSize: 14}});
