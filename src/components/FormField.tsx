import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { colors, radius } from '../theme';
export function FormField({label, ...props}: TextInputProps & {label: string}) {
  return <View style={styles.wrap}><Text style={styles.label}>{label}</Text><TextInput accessibilityLabel={label} placeholderTextColor="#9A9890" {...props} style={[styles.input, props.multiline && styles.multiline, props.style]}/></View>;
}
const styles = StyleSheet.create({wrap: {gap: 7}, label: {fontSize: 13, fontWeight: '700', color: colors.muted}, input: {backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm, minHeight: 48, paddingHorizontal: 14, fontSize: 16, color: colors.ink}, multiline: {height: 90, paddingTop: 13, textAlignVertical: 'top'}});
