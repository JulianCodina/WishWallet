import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee from '@notifee/react-native';
import { lightColors, darkColors } from '../colors';
import { showAlerta } from '../components/Alerta';

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [tema, setTema] = useState();
  const [balance, setBalance] = useState(undefined);
  const [gastos, setGastos] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState({
    alias: 'dream.wallet.user',
    cvu: '0000000000000000',
    UserName: 'Usuario Fulanito',
    CUIL: '20-45000001-8',
  });

  const isFirstLoad = useRef(true);

  const colors = tema === 'claro' ? lightColors : darkColors;

  const cambiarTema = () => {
    setTema(prevTema => {
      const nuevoTema = prevTema === 'claro' ? 'oscuro' : 'claro';
      AsyncStorage.setItem('tema', nuevoTema)
        .then(() => console.log('Tema guardado:', nuevoTema))
        .catch(error => console.error('Error al guardar el tema:', error));
      return nuevoTema;
    });
  };

  const sumarBalance = suma => {
    setBalance(balance + parseFloat(suma));
  };

  const restarBalance = resta => {
    setBalance(balance - parseFloat(resta));
  };

  const agregarGasto = gasto => {
    setGastos(prevGastos => [...prevGastos, gasto]);
  };

  const cambiarAlias = nuevoAlias => {
    setUserData(prev => ({
      ...prev,
      alias: nuevoAlias,
    }));
  };

  const limpiarStorage = () => {
    AsyncStorage.clear();
    setBalance(0);
    setTema(tema);
    setGastos([]);
    console.log('Storage limpio');
  };

  // Carga de Storage
  useEffect(() => {
    const cargarStorage = async () => {
      try {
        const balanceStorage = await AsyncStorage.getItem('balance');
        const temaStorage = await AsyncStorage.getItem('tema');
        const gastosStorage = await AsyncStorage.getItem('gastos');
        console.log(
          'Storage cargado:\nBalance: ',
          balanceStorage,
          '\nTema: ',
          temaStorage,
          '\nGastos: ',
          JSON.parse(gastosStorage).length,
        );

        if (balanceStorage !== null) {
          setBalance(parseFloat(balanceStorage) || 0);
        } else {
          setBalance(0);
        }
        if (temaStorage) {
          setTema(temaStorage);
        } else {
          setTema('oscuro');
          await AsyncStorage.setItem('tema', 'oscuro');
        }
        if (gastosStorage) {
          const parsedGastos = JSON.parse(gastosStorage);
          setGastos(parsedGastos);
        } else {
          setGastos([]);
          await AsyncStorage.setItem('gastos', JSON.stringify([]));
        }
      } catch (error) {
        console.error('Error al cargar el storage:', error);
      } finally {
        setLoading(false);
        console.log('Fin loading');
        isFirstLoad.current = false;
      }
    };
    cargarStorage();
  }, []);

  useEffect(() => {
    if (balance === undefined) return;
    const guardarBalance = async () => {
      try {
        if (isNaN(balance)) {
          await AsyncStorage.setItem('balance', '0');
          console.log('Balance guardado en storage: ', 0);
        } else {
          await AsyncStorage.setItem('balance', balance.toString());
          console.log('Balance guardado en storage: ', balance);
        }
      } catch (error) {
        console.log(error);
      }
    };
    guardarBalance();
  }, [balance]);

  useEffect(() => {
    if (isFirstLoad.current) return;
    const guardarTema = async () => {
      try {
        if (tema === undefined) {
          await AsyncStorage.setItem('tema', 'claro');
        } else {
          await AsyncStorage.setItem('tema', tema);
        }
        console.log('Tema guardado en storage: ', tema);
      } catch (error) {
        console.log(error);
      }
    };
    guardarTema();
  }, [tema]);

  useEffect(() => {
    if (gastos === undefined) return;
    const guardarGastos = async () => {
      try {
        if (gastos === undefined) {
          await AsyncStorage.setItem('gastos', JSON.stringify([]));
        } else {
          await AsyncStorage.setItem('gastos', JSON.stringify(gastos));
        }
        console.log('Gastos guardados en storage: ', gastos);
      } catch (error) {
        console.log(error);
      }
    };
    guardarGastos();
  }, [gastos]);

  // Notificaciones y gastos automáticos
  useEffect(() => {
    if (loading || balance === undefined || gastos === undefined) {
      console.log('Esperando inicialización...', { loading, balance, gastos });
      return;
    }

    const gastosDisponibles = [
      { nombre: 'Netflix', monto: 5999.99, categoria: 'Suscripciones' },
      { nombre: 'Spotify Premium', monto: 4599.29, categoria: 'Suscripciones' },
      { nombre: 'Disney+', monto: 7899.59, categoria: 'Suscripciones' },
      { nombre: 'YouTube Premium', monto: 2199.55, categoria: 'Suscripciones' },
      { nombre: 'Amazon Prime', monto: 6499.25, categoria: 'Suscripciones' },
      { nombre: 'HBO Max', monto: 5499.75, categoria: 'Suscripciones' },
      { nombre: 'Microsoft 365', monto: 12999.79, categoria: 'Suscripciones' },
      { nombre: 'iCloud+', monto: 7999.15, categoria: 'Suscripciones' },
      {
        nombre: 'PlayStation Plus',
        monto: 7999.99,
        categoria: 'Suscripciones',
      },
      { nombre: 'Xbox Game Pass', monto: 8799.0, categoria: 'Suscripciones' },
      { nombre: 'Restaurante Lamur', monto: 15000.0, categoria: 'Comidas' },
      { nombre: 'Cafe Negro', monto: 6500.0, categoria: 'Comidas' },
      { nombre: 'YPF Gasolina', monto: 12000.55, categoria: 'Transporte' },
      { nombre: 'SUBE', monto: 3500.85, categoria: 'Transporte' },
      { nombre: 'Banco Nación AR', monto: 150000.95, categoria: 'Prestamo' },
      { nombre: 'Ropa Clean', monto: 11000.0, categoria: 'Compras' },
      { nombre: 'Computar SRL', monto: 15000.15, categoria: 'Compras' },
    ];

    const procesarGastoAutomatico = async () => {
      if (balance <= 0) {
        return;
      }

      const gasto =
        gastosDisponibles[Math.floor(Math.random() * gastosDisponibles.length)];

      try {
        if (balance >= gasto.monto) {
          const nuevoGasto = {
            id: Date.now().toString(),
            descripcion: gasto.categoria + ' ' + gasto.nombre,
            monto: gasto.monto,
            fecha: new Date().toISOString(),
            categoria: gasto.categoria,
            result: 'success',
          };
          agregarGasto(nuevoGasto);
          restarBalance(gasto.monto);
          showAlerta(
            'success',
            'Pago realizado',
            `Se ha realizado un pago de $${gasto.monto} por ${gasto.nombre}`,
          );
          const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Gastos Automáticos',
          });
          await notifee.displayNotification({
            title: 'Pagos y Servicios',
            body: `Se ha realizado un pago de $${gasto.monto} por ${gasto.nombre}`,
            android: {
              channelId,
              pressAction: {
                id: 'default',
              },
            },
          });
        } else {
          const nuevoGasto = {
            id: Date.now().toString(),
            descripcion: gasto.categoria + ' ' + gasto.nombre,
            monto: gasto.monto,
            fecha: new Date().toISOString(),
            categoria: gasto.categoria,
            result: 'error',
          };
          agregarGasto(nuevoGasto);
          showAlerta(
            'error',
            'Pago fallido',
            `No tienes saldo suficiente para pagar ${gasto.nombre} ($${gasto.monto}).`,
          );
          const channelId = await notifee.createChannel({
            id: 'error_channel',
            name: 'Errores de Pago',
          });
          await notifee.displayNotification({
            title: 'Pago fallido',
            body: `No tienes saldo suficiente para pagar ${gasto.nombre} ($${gasto.monto})`,
            android: {
              channelId,
              pressAction: {
                id: 'error',
              },
            },
          });
        }

        console.log(
          `Gasto automático procesado: ${gasto.nombre} - $${gasto.monto}`,
        );
      } catch (error) {
        console.error('Error en el proceso de pago:', error.message);
      }
    };

    const intervalId = setInterval(procesarGastoAutomatico, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, [loading, balance, gastos]);

  const valorContexto = {
    loading,
    tema,
    colors,
    balance,
    gastos,
    userData,
    cambiarTema,
    sumarBalance,
    restarBalance,
    agregarGasto,
    limpiarStorage,
    cambiarAlias,
  };

  return (
    <AppContext.Provider value={valorContexto}>{children}</AppContext.Provider>
  );
};

export default AppContext;
