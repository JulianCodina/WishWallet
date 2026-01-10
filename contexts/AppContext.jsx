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
  const [gastosPorFecha, setGastosPorFecha] = useState({});

  const [activeTab, setActiveTab] = useState('home');

  const [userData, setUserData] = useState({
    alias: 'wish.wallet.user',
    cvu: '0000009600020981681002',
    userName: 'Usuario Fulanito',
    CUIL: '20-45000001-8',
  });

  const isFirstLoad = useRef(true);

  const colors = tema === 'claro' ? lightColors : darkColors;

  const defaultGastosDec2025 = [
    {
      id: 'gasto1',
      descripcion: 'Salario',
      monto: 250000,
      fecha: '2026-01-01T09:00:00',
      categoria: 'Ingresos',
      origen: 'RRHH',
      result: 'profit',
    },
    {
      id: 'gasto2',
      descripcion: 'Supermercado',
      monto: 42000,
      fecha: '2026-01-01T18:30:00',
      categoria: 'Comidas',
      origen: 'Carrefour',
      result: 'success',
    },
    {
      id: 'gasto3',
      descripcion: 'Transporte',
      monto: 8000,
      fecha: '2026-01-01T08:10:00',
      categoria: 'Transporte',
      origen: 'Uber',
      result: 'success',
    },
    {
      id: 'gasto4',
      descripcion: 'Venta freelance',
      monto: 60000,
      fecha: '2026-01-02T14:00:00',
      categoria: 'Ingresos',
      origen: 'Freelancer',
      result: 'profit',
    },
    {
      id: 'gasto5',
      descripcion: 'Restaurante',
      monto: 25000,
      fecha: '2026-01-02T21:15:00',
      categoria: 'Comidas',
      origen: 'La Chimenea',
      result: 'success',
    },
    {
      id: 'gasto6',
      descripcion: 'Internet',
      monto: 18000,
      fecha: '2026-01-03T10:00:00',
      categoria: 'Servicios',
      origen: 'Gygared',
      result: 'success',
    },
    {
      id: 'gasto7',
      descripcion: 'Regalo',
      monto: 15000,
      fecha: '2026-01-05T16:40:00',
      categoria: 'Compras',
      origen: 'Steam',
      result: 'success',
    },
    {
      id: 'gasto8',
      descripcion: 'Intereses',
      monto: 5000,
      fecha: '2026-01-05T12:00:00',
      categoria: 'Ingresos',
      origen: 'Banco Nación',
      result: 'profit',
    },
    {
      id: 'gasto9',
      descripcion: 'Combustible',
      monto: 20000,
      fecha: '2026-01-6T08:20:00',
      categoria: 'Transporte',
      origen: 'YPF',
      result: 'success',
    },
    {
      id: 'gasto10',
      descripcion: 'Farmacia',
      monto: 12000,
      fecha: '2026-01-6T19:05:00',
      categoria: 'Salud',
      origen: 'FarmaCity',
      result: 'success',
    },
    {
      id: 'gasto11',
      descripcion: 'Transferencia',
      monto: 5000,
      fecha: '2026-01-7T12:00:00',
      categoria: 'Ingresos',
      origen: 'Pablo',
      result: 'profit',
    },
    {
      id: 'gasto12',
      descripcion: 'Transferencia',
      monto: 3000,
      fecha: '2026-01-8T13:00:00',
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
          aliasStorage !== null ? aliasStorage : 'wish.wallet.user',
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
            alias: 'wish.wallet.user',
          }));
          await AsyncStorage.setItem('alias', 'wish.wallet.user');
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

  // Agrupar gastos por fecha
  useEffect(() => {
    if (gastos && Array.isArray(gastos)) {
      const grouped = gastos.reduce((acc, gasto) => {
        const date = new Date(gasto.fecha);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const fecha = `${day}/${month}/${year}`;

        if (!acc[fecha]) {
          acc[fecha] = [];
        }
        acc[fecha].push(gasto);
        return acc;
      }, {});
      setGastosPorFecha(grouped);
    }
  }, [gastos]);

  const procesarGastoAutomaticoRef = useRef();
  const procesarTransferenciaRecibidaRef = useRef();

  // gastos automáticos
  useEffect(() => {
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

    procesarGastoAutomaticoRef.current = async () => {
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
  }, [balance, gastos, agregarGasto, restarBalance]);

  // transferencias recibidas
  useEffect(() => {
    const personasFicticias = [
      { nombre: 'María González', alias: 'maria.gonzalez' },
      { nombre: 'Juan Pérez', alias: 'juan.perez' },
      { nombre: 'Carlos Rodríguez', alias: 'carlos.rod' },
      { nombre: 'Ana Martínez', alias: 'ana.martinez' },
      { nombre: 'Pablo Fernández', alias: 'pablo.fer' },
      { nombre: 'Laura Sánchez', alias: 'laura.sanchez' },
      { nombre: 'Diego López', alias: 'diego.lopez' },
      { nombre: 'Sofía Ramírez', alias: 'sofia.ramirez' },
      { nombre: 'Martín Torres', alias: 'martin.torres' },
      { nombre: 'Valentina Castro', alias: 'vale.castro' },
      { nombre: 'Lucas Morales', alias: 'lucas.morales' },
      { nombre: 'Camila Ruiz', alias: 'cami.ruiz' },
    ];

    const montosDisponibles = [5000, 7500, 10000, 12500, 15000, 17500, 20000];

    procesarTransferenciaRecibidaRef.current = async () => {
      if (balance <= 0) {
        return;
      }

      const persona =
        personasFicticias[Math.floor(Math.random() * personasFicticias.length)];
      const monto =
        montosDisponibles[Math.floor(Math.random() * montosDisponibles.length)];

      try {
        const nuevaTransferencia = {
          id: Date.now().toString(),
          descripcion: 'Transferencia',
          origen: persona.nombre,
          monto: monto,
          fecha: new Date().toISOString(),
          categoria: 'Ingresos',
          result: 'profit',
        };

        agregarGasto(nuevaTransferencia);
        sumarBalance(monto);

        showAlerta(
          'success',
          'Transferencia recibida',
          `Recibiste $${monto.toLocaleString('es-AR')} de ${persona.nombre}`,
        );

        const channelId = await notifee.createChannel({
          id: 'transferencias',
          name: 'Transferencias Recibidas',
        });

        await notifee.displayNotification({
          title: 'Transferencia recibida',
          body: `${persona.nombre} te envió $${monto.toLocaleString('es-AR')}`,
          android: {
            channelId,
            pressAction: {
              id: 'default',
            },
          },
        });

        console.log(
          `Transferencia recibida: ${persona.nombre} - $${monto.toLocaleString(
            'es-AR',
          )}`,
        );
      } catch (error) {
        console.error('Error al procesar transferencia:', error.message);
      }
    };
  }, [balance, gastos, agregarGasto, sumarBalance]);

  useEffect(() => {
    if (loading || balance === undefined || gastos === undefined) {
      return;
    }

    // Intervalo para gastos automáticos (cada 31 segundos)
    const intervalGastos = setInterval(() => {
      if (procesarGastoAutomaticoRef.current) {
        procesarGastoAutomaticoRef.current();
      }
    }, 31000);

    // Intervalo para transferencias recibidas (cada 43 segundos)
    const intervalTransferencias = setInterval(() => {
      if (procesarTransferenciaRecibidaRef.current) {
        procesarTransferenciaRecibidaRef.current();
      }
    }, 43000);

    return () => {
      clearInterval(intervalGastos);
      clearInterval(intervalTransferencias);
    };
  }, [loading]);

  const valorContexto = useMemo(
    () => ({
      loading,
      tema,
      colors,
      balance,
      gastos,
      gastosPorFecha,
      userData,
      cambiarTema,
      sumarBalance,
      restarBalance,
      agregarGasto,
      limpiarStorage,
      cambiarAlias,
      activeTab,
      setActiveTab,
    }),
    [
      loading,
      tema,
      colors,
      balance,
      gastos,
      gastosPorFecha,
      userData,
      cambiarTema,
      sumarBalance,
      restarBalance,
      agregarGasto,
      limpiarStorage,
      cambiarAlias,
      activeTab,
      setActiveTab,
    ],
  );

  return (
    <AppContext.Provider value={valorContexto}>{children}</AppContext.Provider>
  );
};

export default AppContext;
