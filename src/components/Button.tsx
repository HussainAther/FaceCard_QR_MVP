import { ActivityIndicator, Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';
import { colors, radius } from '../theme';

export function Button({label, onPress, variant = 'primary', disabled, loading, style}: {
  label: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'danger' | 'text'; disabled?: boolean; loading?: boolean; style?: ViewStyle;
}) {
  const dark = variant === 'primary';
  return <Pressable accessibilityRole="button" disabled={disabled || loading} onPress={onPress} style={({pressed}) => [styles.base, styles[variant], (disabled || loading) && styles.disabled, pressed && styles.pressed, style]}>
    {loading ? <ActivityIndicator color={dark ? colors.white : colors.ink}/> : <Text style={[styles.label, dark && styles.light, variant === 'danger' && styles.dangerLabel]}>{label}</Text>}
  </Pressable>;
}

const styles = StyleSheet.create({
  base: {minHeight: 52, borderRadius: radius.md, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center'},
  primary: {backgroundColor: colors.ink}, secondary: {backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line},
  danger: {backgroundColor: '#FFF2F0', borderWidth: 1, borderColor: '#E9B9B4'}, text: {backgroundColor: 'transparent'},
  label: {fontSize: 16, fontWeight: '700', color: colors.ink}, light: {color: colors.white}, dangerLabel: {color: colors.danger},
  disabled: {opacity: .42}, pressed: {opacity: .72},
});
