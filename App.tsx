import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/hooks/useApp';
import type { RootStackParamList } from './src/navigation/types';
import { colors } from './src/theme';
import { WelcomeScreen } from './src/screens/WelcomeScreen'; import { PrivacyScreen } from './src/screens/PrivacyScreen'; import { EnrollmentScreen } from './src/screens/EnrollmentScreen'; import { GenerateIdentityScreen } from './src/screens/GenerateIdentityScreen'; import { HomeScreen } from './src/screens/HomeScreen'; import { CardEditorScreen } from './src/screens/CardEditorScreen'; import { CardViewScreen } from './src/screens/CardViewScreen'; import { ScannerScreen } from './src/screens/ScannerScreen'; import { ScannedCardScreen } from './src/screens/ScannedCardScreen'; import { PaywallScreen } from './src/screens/PaywallScreen'; import { SettingsScreen } from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
function Navigator() {
  const app = useApp();
  if (!app.ready) return <View style={styles.loading}><ActivityIndicator size="large" color={colors.ink}/></View>;
  return <NavigationContainer><StatusBar style="dark"/><Stack.Navigator initialRouteName={app.identity ? 'Home' : 'Welcome'} screenOptions={{headerStyle: {backgroundColor: colors.paper}, headerShadowVisible: false, headerTintColor: colors.ink, headerTitleStyle: {fontWeight: '600'}, contentStyle: {backgroundColor: colors.paper}, animation: 'slide_from_right'}}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} options={{headerShown: false}}/><Stack.Screen name="Privacy" component={PrivacyScreen} options={{title: ''}}/><Stack.Screen name="Enrollment" component={EnrollmentScreen} options={{title: ''}}/><Stack.Screen name="GenerateIdentity" component={GenerateIdentityScreen} options={{headerBackVisible: false, title: ''}}/>
    <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/><Stack.Screen name="CardEditor" component={CardEditorScreen} options={{title: ''}}/><Stack.Screen name="CardView" component={CardViewScreen} options={{title: ''}}/><Stack.Screen name="Scanner" component={ScannerScreen} options={{headerShown: false, presentation: 'fullScreenModal'}}/><Stack.Screen name="ScannedCard" component={ScannedCardScreen} options={{title: ''}}/><Stack.Screen name="Paywall" component={PaywallScreen} options={{title: '', presentation: 'modal'}}/><Stack.Screen name="Settings" component={SettingsScreen} options={{title: ''}}/>
  </Stack.Navigator></NavigationContainer>;
}
export default function App() { return <SafeAreaProvider><AppProvider><Navigator/></AppProvider></SafeAreaProvider>; }
const styles = StyleSheet.create({loading: {flex: 1, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center'}});
