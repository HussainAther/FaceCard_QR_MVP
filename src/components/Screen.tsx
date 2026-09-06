import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';

export function Screen({children, scroll = true, contentStyle}: {children: ReactNode; scroll?: boolean; contentStyle?: ViewStyle}) {
  const content = scroll
    ? <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.content, contentStyle]}>{children}</ScrollView>
    : <View style={[styles.content, styles.flex, contentStyle]}>{children}</View>;
  return <SafeAreaView edges={['bottom']} style={styles.safe}><KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>{content}</KeyboardAvoidingView></SafeAreaView>;
}
const styles = StyleSheet.create({safe: {flex: 1, backgroundColor: colors.paper}, flex: {flex: 1}, content: {padding: 20, gap: 16}});
