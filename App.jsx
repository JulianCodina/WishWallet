import {
  Text,
  StyleSheet,
  View,
  Pressable,
  StatusBar,
  AppState,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { StrictMode, useEffect } from 'react';
import AppContext, { AppProvider, useAppContext } from './contexts/AppContext';
import BalanceCard from './components/BalanceCard';
import Ofertas from './components/Ofertas';
import Interes from './components/Interes';
import Alerta, { showAlerta } from './components/Alerta';
import notifee from '@notifee/react-native';
import GraphCard from './components/GraphCard';

// Iconos
import Icon from 'react-native-vector-icons/MaterialIcons';

function AppContent() {
  const { loading, tema, colors, cambiarTema, limpiarStorage } =
    useAppContext();

  const styles = StyleSheet.create({
    page: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
      gap: 10,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerText: {
      fontSize: 20,
      color: colors.text,
      fontWeight: 'bold',
    },
    notificationButton: {
      backgroundColor: colors.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 4,
      borderRadius: 20,
      marginLeft: 'auto',
    },
    headerButton: {
      backgroundColor: colors.secondary,
      width: 105,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
    },
    headerButtonText: {
      color: colors.primary,
      fontWeight: '500',
    },
  });

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
    <StrictMode>
      <View style={styles.page}>
        <StatusBar
          backgroundColor={colors.card}
          barStyle={tema === 'claro' ? 'dark-content' : 'light-content'}
        />
        <View style={styles.header}>
          <Icon name="account-balance-wallet" size={25} color={colors.text} />
          <Text style={styles.headerText}>Dream Wallet</Text>
          <Pressable
            style={styles.notificationButton}
            onPress={() => limpiarStorage()}
          >
            <Icon name="notifications-none" size={20} color={colors.primary} />
          </Pressable>
          <Pressable onPress={() => cambiarTema()} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>Tema {tema}</Text>
          </Pressable>
        </View>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <BalanceCard />
          <Ofertas />
          <Interes />
          <GraphCard />
        </ScrollView>
      </View>
      <Alerta />
    </StrictMode>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
export default App;
