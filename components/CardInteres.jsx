import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showAlerta } from './Alerta';

import Icon from 'react-native-vector-icons/MaterialIcons';

const INTERES = 36;

function Interes() {
  const { colors, balance, sumarBalance, restarBalance, agregarGasto } =
    useAppContext();
  const [ahorros, setAhorros] = useState(0);
  const [ahorroInicial, setAhorroInicial] = useState(0);
  const intervalRef = useRef(null);

  const [value, setValue] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('deposit'); // 'deposit' o 'withdraw'
  const [interestEarned, setInterestEarned] = useState(0);

  const onClose = () => {
    setModalVisible(false);
    setValue('');
  };

  const handleDepositar = () => {
    setModalMode('deposit');
    setValue('');
    setModalVisible(true);
  };

  const handleRetirar = () => {
    if (ahorros > 0) {
      setModalMode('withdraw');
      setValue(ahorros.toString());
      setModalVisible(true);
    }
  };

  const onConfirm = () => {
    if (modalMode === 'deposit') {
      const numericValue = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
      if (balance >= numericValue) {
        const frasco = {
          id: Date.now().toString(),
          descripcion: 'Frasco de ahorro',
          monto: parseFloat(numericValue),
          origen: 'WishWallet',
          fecha: new Date().toISOString(),
          categoria: 'Ahorros',
          result: 'success',
        };

        restarBalance(numericValue);
        setAhorroInicial(prev => prev + numericValue);
        setAhorros(prev => prev + numericValue);
        showAlerta('success', 'Listo!', 'Tus ahorros ya estan creciendo');
        setModalVisible(false);
        setValue('');

        agregarGasto(frasco);
      } else {
        showAlerta('error', 'Ups', 'No tienes suficiente saldo');
      }
    } else {
      if (ahorros > 0) {
        const frasco = {
          id: Date.now().toString(),
          descripcion: 'Frasco de ahorro',
          monto: parseFloat(ahorros.toFixed(2)),
          origen: 'WishWallet',
          fecha: new Date().toISOString(),
          categoria: 'Ahorros',
          result: 'profit',
        };

        sumarBalance(ahorros);
        showAlerta(
          'success',
          'Retiro exitoso',
          `Se han acreditado ${formatCurrency(ahorros)} a tu cuenta`,
        );
        setAhorros(0);
        setAhorroInicial(0);
        setInterestEarned(0);
        setModalVisible(false);
        setValue('');
        agregarGasto(frasco);
      }
    }
  };

  const handleNumericInput = (text, setter) => {
    const numericValue = text.replace(/[^0-9.]/g, '');

    const numberPart = numericValue.split('.')[0];
    if (numberPart && numberPart.length > 4) {
      showAlerta('error', 'Ups', 'El monto máximo a invertir es de 9,999');
      return;
    }

    const parts = numericValue.split('.');
    if (parts.length > 2) return;

    setter(parts[0] + (parts[1] ? `.${parts[1]}` : ''));
  };

  // carga del asyncstorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const Ahorros = await AsyncStorage.getItem('Ahorros');
        const AhorroInicial = await AsyncStorage.getItem('AhorroInicial');
        if (Ahorros) setAhorros(parseFloat(Ahorros));
        if (AhorroInicial) setAhorroInicial(parseFloat(AhorroInicial));
      } catch (error) {
        console.error('Error loading savings data:', error);
      }
    };
    loadData();
  }, []);

  // suma de interes
  useEffect(() => {
    if (ahorros > 0) {
      intervalRef.current = setInterval(async () => {
        const newAmount = ahorros + ahorros * (INTERES / 300);
        await AsyncStorage.setItem('Ahorros', newAmount.toString());
        await AsyncStorage.setItem('AhorroInicial', ahorroInicial.toString());
        setAhorros(newAmount);
      }, 15000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [ahorros, ahorroInicial]);

  // Calcular interés ganado
  useEffect(() => {
    if (ahorros > ahorroInicial) {
      setInterestEarned(ahorros - ahorroInicial);
    }
  }, [ahorros, ahorroInicial]);

  const inputRef = useRef(null);
  useEffect(() => {
    if (modalVisible) {
      const t = setTimeout(() => {
        inputRef.current?.focus?.();
      }, 200); // Forzar focus porque anda raro

      return () => clearTimeout(t);
    }
  }, [modalVisible]);

  const formatCurrency = value => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
        onPress={handleDepositar}
        activeOpacity={0.9}
      >
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <Icon name={'savings'} size={40} color={colors.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: colors.label }]}>
              Mis ahorros
            </Text>
            <Text style={[styles.amount, { color: colors.text }]}>
              {ahorros > 0 ? formatCurrency(ahorros) : 'Crea un Frasco'}
            </Text>
            <Text style={[styles.interestEarned, { color: colors.primary }]}>
              {interestEarned > 0
                ? 'Generaste ' + formatCurrency(interestEarned)
                : 'Retiralo cuando quieras'}
            </Text>
          </View>
          <View style={styles.apyContainer}>
            <Text style={[styles.apyText, { color: colors.primary }]}>
              {INTERES}%
            </Text>
            <Text style={[styles.apyLabel, { color: colors.label }]}>TEA</Text>
          </View>
        </View>
      </TouchableOpacity>

      {ahorros > 0 && (
        <TouchableOpacity
          style={[
            styles.retirarButton,
            {
              backgroundColor: colors.primary,
            },
          ]}
          onPress={handleRetirar}
          activeOpacity={0.9}
        >
          <Text style={{ color: colors.contrast, fontWeight: 'bold' }}>
            Retirar ahorros
          </Text>
        </TouchableOpacity>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          behavior="height"
          style={styles.modalContainer}
          pointerEvents="box-none"
        >
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>

          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {modalMode === 'deposit' ? 'Ingresar monto' : 'Retirar ahorros'}
            </Text>

            {modalMode === 'deposit' ? (
              <>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                      borderColor: colors.primary,
                    },
                  ]}
                  placeholder="$0"
                  placeholderTextColor={colors.label}
                  value={value ? `$${value}` : ''}
                  onChangeText={text => handleNumericInput(text, setValue)}
                  keyboardType="decimal-pad"
                  ref={inputRef}
                />
                <Text style={[styles.balanceText, { color: colors.label }]}>
                  Saldo disponible: ${parseFloat(balance || 0).toFixed(2)}
                </Text>
              </>
            ) : (
              <Text
                style={[
                  styles.withdrawAmount,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {formatCurrency(ahorros)}
              </Text>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {
                    marginRight: 10,
                    borderColor: colors.primary,
                    backgroundColor: colors.secondary,
                  },
                ]}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={{ color: colors.primary, fontWeight: '500' }}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {
                    backgroundColor:
                      modalMode === 'deposit' && !value
                        ? `${colors.primary}80`
                        : colors.primary,
                  },
                ]}
                onPress={onConfirm}
                activeOpacity={0.7}
                disabled={modalMode === 'deposit' && !value}
              >
                <Text style={{ color: colors.contrast, fontWeight: 'bold' }}>
                  {modalMode === 'deposit' ? 'Confirmar' : 'Retirar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    borderWidth: 1,
    borderBottomWidth: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  interestEarned: {
    fontSize: 14,
  },
  apyContainer: {
    alignItems: 'center',
  },
  apyText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  apyLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  retirarButton: {
    marginTop: 15,
    marginHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '70%',
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 30,
    marginBottom: 10,
    fontSize: 16,
    alignItems: 'center',
    textAlign: 'center',
    minWidth: '25%',
    marginHorizontal: 'auto',
  },
  balanceText: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
  },
  withdrawAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    paddingVertical: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '20',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 1,
    borderColor: 'transparent',
  },
});

export default Interes;
