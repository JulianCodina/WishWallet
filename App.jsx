import { Text, StyleSheet, View, Pressable, StatusBar } from 'react-native';
import { StrictMode } from 'react';
import AppContext, { AppProvider, useAppContext } from './contexts/AppContext';
import BalanceCard from './components/BalanceCard';
import Alerta, { showAlerta } from './components/Alerta';

// Iconos
import Icon from 'react-native-vector-icons/MaterialIcons';

function AppContent() {
  const { tema, colors, cambiarTema } = useAppContext();

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
          <Pressable style={styles.notificationButton}>
            <Icon name="notifications-none" size={20} color={colors.primary} />
          </Pressable>
          <Pressable onPress={() => cambiarTema()} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>Tema {tema}</Text>
          </Pressable>
        </View>
        <BalanceCard />
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
