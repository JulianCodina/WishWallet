import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
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
    cvu: '0000009600020981681002',
    userName: 'Usuario Fulanito',
    CUIL: '20-45000001-8',
  });

  const isFirstLoad = useRef(true);

  const colors = tema === 'claro' ? lightColors : darkColors;

  const defaultGastosDec2025 = [
    {
      id: 'g1',
      descripcion: 'Salario',
      monto: 250000,
      fecha: '2025-12-01T09:00:00',
      categoria: 'Ingresos',
      origen: 'RRHH',
      result: 'profit',
    },
    {
      id: 'g2',
      descripcion: 'Supermercado',
      monto: 42000,
      fecha: '2025-12-02T18:30:00',
      categoria: 'Comidas',
      origen: 'Carrefour',
      result: 'success',
    },
    {
      id: 'g3',
      descripcion: 'Transporte',
      monto: 8000,
      fecha: '2025-12-03T08:10:00',
      categoria: 'Transporte',
      origen: 'Uber',
      result: 'success',
    },
    {
      id: 'g4',
      descripcion: 'Venta freelance',
      monto: 60000,
      fecha: '2025-12-04T14:00:00',
      categoria: 'Ingresos',
      origen: 'Freelancer',
      result: 'profit',
    },
    {
      id: 'g5',
      descripcion: 'Restaurante',
      monto: 25000,
      fecha: '2025-12-05T21:15:00',
      categoria: 'Comidas',
      origen: 'La Chimenea',
      result: 'success',
    },
    {
      id: 'g6',
      descripcion: 'Internet',
      monto: 18000,
      fecha: '2025-12-07T10:00:00',
      categoria: 'Servicios',
      origen: 'Gygared',
      result: 'success',
    },
    {
      id: 'g7',
      descripcion: 'Regalo',
      monto: 15000,
      fecha: '2025-12-08T16:40:00',
      categoria: 'Compras',
      origen: 'Steam',
      result: 'success',
    },
    {
      id: 'g8',
      descripcion: 'Intereses',
      monto: 5000,
      fecha: '2025-12-09T12:00:00',
      categoria: 'Ingresos',
      origen: 'Banco Nación',
      result: 'profit',
    },
    {
      id: 'g9',
      descripcion: 'Combustible',
      monto: 20000,
      fecha: '2025-12-10T08:20:00',
      categoria: 'Transporte',
      origen: 'YPF',
      result: 'success',
    },
    {
      id: 'g10',
      descripcion: 'Farmacia',
      monto: 12000,
      fecha: '2025-12-11T19:05:00',
      categoria: 'Salud',
      origen: 'FarmaCity',
      result: 'success',
    },
    {
      id: 'g11',
      descripcion: 'Transferencia',
      monto: 5000,
      fecha: '2025-12-17T12:00:00',
      categoria: 'Ingresos',
      origen: 'Pablo',
      result: 'profit',
    },
    {
      id: 'g12',
      descripcion: 'Transferencia',
      monto: 3000,
      fecha: '2025-12-18T13:00:00',
      categoria: 'Ingresos',
      origen: 'Mauricio',
      result: 'profit',
    },
  ];

  const cambiarTema = useCallback(() => {
    setTema(prevTema => {
      const nuevoTema = prevTema === 'claro' ? 'oscuro' : 'claro';
      AsyncStorage.setItem('tema', nuevoTema)
        .then(() => console.log('Tema guardado:', nuevoTema))
        .catch(error => console.error('Error al guardar el tema:', error));
      return nuevoTema;
    });
  }, []);

  const sumarBalance = useCallback(
    async suma => {
      const nuevoBalance = balance + parseFloat(suma);
      setBalance(nuevoBalance);
      try {
        await AsyncStorage.setItem('balance', nuevoBalance.toString());
        console.log('Balance guardado en storage: ', nuevoBalance);
      } catch (error) {
        console.error('Error al guardar el balance:', error);
      }
    },
    [balance],
  );

  const restarBalance = useCallback(
    async resta => {
      const nuevoBalance = parseFloat(balance) - parseFloat(resta);
      setBalance(nuevoBalance);
      await AsyncStorage.setItem('balance', nuevoBalance.toString())
        .then(() => console.log('Balance guardado en storage: ', nuevoBalance))
        .catch(error => console.error('Error al guardar el balance:', error));
    },
    [balance],
  );

  const agregarGasto = useCallback(async gasto => {
    setGastos(prevGastos => {
      const nuevosGastos = [...prevGastos, gasto];
      AsyncStorage.setItem('gastos', JSON.stringify(nuevosGastos))
        .then(() => console.log('Gastos guardados en storage: ', nuevosGastos))
        .catch(error => console.error('Error al guardar los gastos:', error));
      return nuevosGastos;
    });
  }, []);

  const cambiarAlias = useCallback(async nuevoAlias => {
    setUserData(prev => ({
      ...prev,
      alias: nuevoAlias,
    }));
    await AsyncStorage.setItem('alias', nuevoAlias)
      .then(() => console.log('Alias guardado:', nuevoAlias))
      .catch(error => console.error('Error al guardar el alias:', error));
  }, []);

  const limpiarStorage = useCallback(() => {
    AsyncStorage.clear();
    setBalance(0);
    setTema(tema);
    setGastos([]);
    console.log('Storage limpio');
  }, [tema]);

  // Carga de Storage
  useEffect(() => {
    const cargarStorage = async () => {
      try {
        const balanceStorage = await AsyncStorage.getItem('balance');
        const temaStorage = await AsyncStorage.getItem('tema');
        const gastosStorage = await AsyncStorage.getItem('gastos');
        const aliasStorage = await AsyncStorage.getItem('alias');
        console.log(
          'Storage cargado:\nBalance: ',
          balanceStorage !== null ? parseFloat(balanceStorage) : 0,
          '\nTema: ',
          temaStorage !== 'claro' ? 'oscuro' : 'claro',
          '\nGastos: ',
          gastosStorage ? JSON.parse(gastosStorage).length : 0,
          '\nAlias: ',
          aliasStorage !== null ? aliasStorage : 'dream.wallet.user',
        );

        if (balanceStorage >= 0 && balanceStorage !== null) {
          setBalance(parseFloat(balanceStorage));
        } else {
          setBalance(0);
          await AsyncStorage.setItem('balance', '0');
        }
        if (temaStorage === 'claro' || temaStorage === 'oscuro') {
          setTema(temaStorage);
        } else {
          setTema('oscuro');
          await AsyncStorage.setItem('tema', 'oscuro');
        }
        if (gastosStorage && Array.isArray(JSON.parse(gastosStorage))) {
          const parsedGastos = JSON.parse(gastosStorage);
          setGastos(parsedGastos);
        } else {
          setGastos(defaultGastosDec2025);
          await AsyncStorage.setItem(
            'gastos',
            JSON.stringify(defaultGastosDec2025),
          );
        }
        if (aliasStorage) {
          setUserData(prev => ({
            ...prev,
            alias: aliasStorage,
          }));
        } else {
          setUserData(prev => ({
            ...prev,
            alias: 'dream.wallet.user',
          }));
          await AsyncStorage.setItem('alias', 'dream.wallet.user');
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

  // Notificaciones y gastos automáticos
  useEffect(() => {
    if (loading || balance === undefined || gastos === undefined) {
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
            descripcion: gasto.categoria,
            origen: gasto.nombre,
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
            `Pagaste $${gasto.monto} por ${gasto.nombre}`,
          );
          const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Gastos Automáticos',
          });
          await notifee.displayNotification({
            title: 'Pagos y Servicios',
            body: `Pagaste $${gasto.monto} por ${gasto.nombre}`,
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
            descripcion: gasto.categoria,
            origen: gasto.nombre,
            monto: gasto.monto,
            fecha: new Date().toISOString(),
            categoria: gasto.categoria,
            result: 'error',
          };
          agregarGasto(nuevoGasto);
          showAlerta(
            'error',
            'Pago fallido',
            `No tienes saldo para pagar ${gasto.nombre}.`,
          );
          const channelId = await notifee.createChannel({
            id: 'error_channel',
            name: 'Errores de Pago',
          });
          await notifee.displayNotification({
            title: 'Pago fallido',
            body: `No tienes saldo para pagar ${gasto.nombre}`,
            android: {
              channelId,
              pressAction: {
                id: 'error',
              },
            },
          });
        }

        console.log(`Gasto automático: ${gasto.nombre} - $${gasto.monto}`);
      } catch (error) {
        console.error('Error en el proceso de pago:', error.message);
      }
    };

    const intervalId = setInterval(procesarGastoAutomatico, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, [loading, balance, gastos, agregarGasto, restarBalance]);

  const valorContexto = useMemo(
    () => ({
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
    }),
    [
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
    ],
  );

  return (
    <AppContext.Provider value={valorContexto}>{children}</AppContext.Provider>
  );
};

export default AppContext;
