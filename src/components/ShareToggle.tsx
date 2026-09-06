import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { colors } from '../theme';
export function ShareToggle({label, value, onChange, locked}: {label: string; value: boolean; onChange: (value: boolean) => void; locked?: boolean}) {
  return <Pressable accessibilityRole="switch" accessibilityState={{checked: value, disabled: locked}} onPress={() => !locked && onChange(!value)} style={styles.row}>
    <View><Text style={styles.label}>{label}</Text>{locked && <Text style={styles.pro}>PRO</Text>}</View>
    <Switch value={value} disabled={locked} onValueChange={onChange} trackColor={{false: colors.line, true: colors.green}}/>
  </Pressable>;
}
const styles = StyleSheet.create({row: {minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.soft}, label: {fontSize: 16, color: colors.ink}, pro: {fontSize: 10, color: colors.green, fontWeight: '800', marginTop: 2}});
