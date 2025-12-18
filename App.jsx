import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  StatusBar,
  AppState,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { StrictMode, useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import BalanceCard from './components/CardBalance';
import Ofertas from './components/SectionOfertas';
import Interes from './components/CardInteres';
import Alerta from './components/Alerta';
import notifee from '@notifee/react-native';
import GraphCard from './components/CardGraphics';
import Notificaciones from './components/ModalNotis';
import NavBar from './components/NavBar';
import CardHistorial from './components/CardHistorial';
import LinearGradient from 'react-native-linear-gradient';

// Iconos
import Icon from 'react-native-vector-icons/MaterialIcons';

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
    <StrictMode>
      <LinearGradient
        colors={[colors.secondary, colors.background, colors.background]}
        locations={[0, 0.3, 1]}
        style={styles.page}
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
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <Notificaciones isVisible={isOpenNotis} setOpen={setIsOpenNotis} />
          <BalanceCard />
          <Ofertas />
          <Interes />
          <GraphCard />
          <CardHistorial type={'simple'} />
        </ScrollView>
        <NavBar />
      </LinearGradient>
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

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingBottom: 70,
  },
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
