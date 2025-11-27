import React, { createContext, useContext, useState, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors } from '../colors';

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [tema, setTema] = useState('claro');
  const [balance, setBalance] = useState(0);
  const [gastos, setGastos] = useState([]);

  const cambiarTema = () => {
    setTema(prevTema => (prevTema === 'claro' ? 'oscuro' : 'claro'));
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

  const colors = tema === 'claro' ? lightColors : darkColors;

  const valorContexto = {
    tema,
    colors,
    balance,
    gastos,
    cambiarTema,
    sumarBalance,
    restarBalance,
    agregarGasto,
  };
  /*
  useEffect(() => {
    async function cargarStorage() {
      try {
        await AsyncStorage.getItem('balance');
        await AsyncStorage.getItem('tema');
        await AsyncStorage.getItem('gastos');
      } catch (error) {
        console.log(error);
      }
    }
    cargarStorage();
  }, []);

  useEffect(() => {
    async function guardarStorage() {
      try {
        await AsyncStorage.setItem('balance', balance.toString());
        await AsyncStorage.setItem('tema', tema);
        await AsyncStorage.setItem('gastos', JSON.stringify(gastos));
      } catch (error) {
        console.log(error);
      }
    }
    guardarStorage();
  }, [balance, tema, gastos]);*/

  return (
    <AppContext.Provider value={valorContexto}>{children}</AppContext.Provider>
  );
};

export default AppContext;
