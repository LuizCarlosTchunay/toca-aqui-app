import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

// Screens
import SplashScreen from './screens/SplashScreen';
import IndexScreen from './screens/IndexScreen';
import AuthScreen from './screens/AuthScreen';
import DashboardScreen from './screens/DashboardScreen';
import ExploreScreen from './screens/ExploreScreen';
import EventsScreen from './screens/EventsScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import CreateEventScreen from './screens/CreateEventScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import SettingsScreen from './screens/SettingsScreen';

// Providers
import {AuthProvider} from './hooks/useAuth';
import {ThemeProvider} from './contexts/ThemeContext';

// Types
export type RootStackParamList = {
  Splash: undefined;
  Index: undefined;
  Auth: {mode?: 'login' | 'register' | 'reset-password'};
  Dashboard: undefined;
  Explore: undefined;
  Events: undefined;
  Profile: {id?: string};
  EditProfile: undefined;
  CreateEvent: undefined;
  Notifications: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
      staleTime: 30000,
    },
  },
});

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <NavigationContainer>
                <StatusBar
                  barStyle="light-content"
                  backgroundColor="#0A0A0A"
                  translucent
                />
                <Stack.Navigator
                  initialRouteName="Splash"
                  screenOptions={{
                    headerShown: false,
                    cardStyle: {backgroundColor: '#0A0A0A'},
                  }}>
                  <Stack.Screen name="Splash" component={SplashScreen} />
                  <Stack.Screen name="Index" component={IndexScreen} />
                  <Stack.Screen name="Auth" component={AuthScreen} />
                  <Stack.Screen name="Dashboard" component={DashboardScreen} />
                  <Stack.Screen name="Explore" component={ExploreScreen} />
                  <Stack.Screen name="Events" component={EventsScreen} />
                  <Stack.Screen name="Profile" component={ProfileScreen} />
                  <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                  <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
                  <Stack.Screen name="Notifications" component={NotificationsScreen} />
                  <Stack.Screen name="Settings" component={SettingsScreen} />
                </Stack.Navigator>
              </NavigationContainer>
              <Toast />
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;