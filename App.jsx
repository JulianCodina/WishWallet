import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  StatusBar,
  AppState,
  ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import Alerta from './components/Alerta';
import notifee from '@notifee/react-native';
import NavBar from './components/NavBar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';

// Pages
import PageHome from './pages/PageHome';
import PageHistory from './pages/PageHistory';
import PageStatistics from './pages/PageStatistics';

// Iconos
import Icon from 'react-native-vector-icons/MaterialIcons';

const Stack = createNativeStackNavigator();

function AppContent() {
  const { loading, tema, colors, cambiarTema, limpiarStorage } =
    useAppContext();
  const [isOpenNotis, setIsOpenNotis] = useState(false);

  // Notificaciones
  useEffect(() => {
    const requestPermissions = async () => {
      await notifee.requestPermission();
    };
    requestPermissions();
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
      } else if (nextAppState === 'background') {
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text
          style={{
            color: colors.text,
            marginTop: 10,
            fontSize: 16,
          }}
        >
          Cargando...
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[colors.secondary, colors.background, colors.background]}
      locations={[0, 0.3, 1]}
      style={{ flex: 1 }}
    >
      <StatusBar
        backgroundColor={colors.card}
        barStyle={tema === 'claro' ? 'dark-content' : 'light-content'}
      />
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Icon name="account-balance-wallet" size={25} color={colors.text} />
        <Text
          style={[styles.headerText, { color: colors.text }]}
          onPress={() => limpiarStorage()}
        >
          Dream Wallet
        </Text>
        <TouchableOpacity
          style={[
            styles.notificationButton,
            { backgroundColor: colors.secondary },
          ]}
          onPress={() => setIsOpenNotis(true)}
          activeOpacity={0.6}
        >
          <Icon name="notifications-none" size={20} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => cambiarTema()}
          style={[styles.headerButton, { backgroundColor: colors.secondary }]}
          activeOpacity={0.6}
        >
          <Text style={[styles.headerButtonText, { color: colors.primary }]}>
            Tema {tema}
          </Text>
        </TouchableOpacity>
      </View>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="Home">
            {props => (
              <PageHome
                {...props}
                isOpenNotis={isOpenNotis}
                setIsOpenNotis={setIsOpenNotis}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="History" component={PageHistory} />
          <Stack.Screen name="Statistics" component={PageStatistics} />
        </Stack.Navigator>
        <NavBar />
      </NavigationContainer>
      <Alerta />
    </LinearGradient>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    gap: 10,
    borderBottomWidth: 1,
    position: 'relative',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  notificationButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    borderRadius: 20,
    marginLeft: 'auto',
  },
  headerButton: {
    width: 105,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  headerButtonText: {
    fontWeight: '500',
  },
});

export default App;
