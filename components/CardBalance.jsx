import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ModalIngresar from './ModalIngresar';
import ModalTransferir from './ModalTransferir';
import ModalAlias from './ModalAlias';
import { useAppContext } from '../contexts/AppContext';
import { showAlerta } from './Alerta';

function BalanceCard() {
  const {
    loading,
    balance,
    colors,
    sumarBalance,
    restarBalance,
    agregarGasto,
  } = useAppContext();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isIngresarVisible, setIsIngresarVisible] = useState(false);
  const [isTransferirVisible, setIsTransferirVisible] = useState(false);
  const [isAliasVisible, setIsAliasVisible] = useState(false);
  const [monto, setMonto] = useState('');

  const balanceEntero = Math.floor(balance);
  const centavos = Math.round((balance - balanceEntero) * 100)
    .toString()
    .padStart(2, '0');

  const handleIngresar = () => {
    if (monto > 0) {
      if (parseFloat(monto) + parseFloat(balance) > 9999999) {
        showAlerta('error', 'Ups', 'Puede tener máximo $9.999.999');
      } else {
        const nuevoGasto = {
          id: Date.now().toString(),
          descripcion: 'Ingreso de dinero',
          monto: monto,
          origen: 'Banco Nación',
          fecha: new Date().toISOString(),
          categoria: 'Ingreso',
          result: 'profit',
        };
        console.log('Monto a ingresar:', monto);
        setMonto('');
        sumarBalance(monto);
        setIsIngresarVisible(false);
        agregarGasto(nuevoGasto);
        showAlerta(
          'success',
          'Listo!',
          'La operación se completó correctamente.',
        );
      }
    }
  };

  const handleTransferir = transferData => {
    const montoTransferencia = parseFloat(transferData.monto);

    if (montoTransferencia <= 0) {
      showAlerta('error', 'Ups', 'El monto debe ser mayor a 0');
      return;
    }

    if (montoTransferencia > balance) {
      showAlerta('error', 'Ups', 'Saldo insuficiente');
      return;
    }

    console.log(
      'Transferencia de $' +
        montoTransferencia +
        ' a ' +
        (transferData.descripcion || 'destinatario'),
    );

    restarBalance(montoTransferencia);
    setIsTransferirVisible(false);

    showAlerta(
      'success',
      'Transferencia exitosa',
      `Se transfirió $${montoTransferencia.toFixed(2)}`,
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.clickableZone}>
          <View style={styles.balanceTitleContainer}>
            <Text style={[styles.balanceTitle, { color: colors.label }]}>
              Disponible
            </Text>
            <Icon name="arrow-right" size={20} color={colors.label} />
          </View>
          <View style={styles.balanceAmount}>
            {loading !== true ? (
              <>
                {isBalanceVisible ? (
                  <>
                    <Text
                      style={[styles.balanceAmountText, { color: colors.text }]}
                    >
                      ${balanceEntero.toLocaleString('es-AR')}
                    </Text>
                    <Text
                      style={[styles.balanceDecimals, { color: colors.label }]}
                    >
                      {centavos}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text
                      style={[styles.balanceAmountText, { color: colors.text }]}
                    >
                      $****
                    </Text>
                    <Text
                      style={[styles.balanceDecimals, { color: colors.label }]}
                    >
                      .**
                    </Text>
                  </>
                )}
              </>
            ) : (
              <ActivityIndicator size="small" color={colors.primary} />
            )}
            <TouchableOpacity
              style={styles.visibilityButton}
              onPress={() => setIsBalanceVisible(!isBalanceVisible)}
              activeOpacity={0.3}
            >
              <Icon
                name={isBalanceVisible ? 'visibility' : 'visibility-off'}
                size={20}
                color={colors.label}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.balanceButtons}>
          <View style={styles.balanceButtonContainer}>
            <TouchableOpacity
              onPress={() => setIsIngresarVisible(true)}
              style={[
                styles.primaryButton,
                { backgroundColor: colors.primary },
              ]}
              activeOpacity={0.6}
            >
              <Icon name="upload" size={25} color={colors.contrast} />
            </TouchableOpacity>
            <Text style={[styles.balanceButtonText, { color: colors.primary }]}>
              Ingresar
            </Text>
          </View>
          <View style={styles.balanceButtonContainer}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={() => setIsTransferirVisible(true)}
              activeOpacity={0.6}
            >
              <Icon name="swap-horiz" size={25} color={colors.contrast} />
            </TouchableOpacity>
            <Text style={[styles.balanceButtonText, { color: colors.primary }]}>
              Transferir
            </Text>
          </View>
          <View style={styles.balanceButtonContainer}>
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                { backgroundColor: colors.secondary },
              ]}
              onPress={() => setIsAliasVisible(true)}
              activeOpacity={0.6}
            >
              <Icon name="text-snippet" size={25} color={colors.primary} />
            </TouchableOpacity>
            <Text style={[styles.balanceButtonText, { color: colors.primary }]}>
              Mi alias
            </Text>
          </View>
          <View style={styles.balanceButtonContainer}>
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                { backgroundColor: colors.secondary },
              ]}
              activeOpacity={0.6}
            >
              <Icon name="credit-card" size={25} color={colors.primary} />
            </TouchableOpacity>
            <Text style={[styles.balanceButtonText, { color: colors.primary }]}>
              Tarjeta
            </Text>
          </View>
        </View>
      </View>

      <ModalIngresar
        isVisible={isIngresarVisible}
        setOpen={setIsIngresarVisible}
        onClose={() => {
          setIsIngresarVisible(false);
          setMonto('');
        }}
        onConfirm={handleIngresar}
        value={monto}
        setValue={setMonto}
      />

      <ModalTransferir
        isVisible={isTransferirVisible}
        setOpen={setIsTransferirVisible}
        onClose={() => {
          setIsTransferirVisible(false);
        }}
        onConfirm={handleTransferir}
      />
      <ModalAlias isVisible={isAliasVisible} setOpen={setIsAliasVisible} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    gap: 10,
    borderWidth: 1,
    borderBottomWidth: 3,
  },
  clickableZone: {
    width: '100%',
    gap: 5,
  },
  balanceTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceTitle: {
    fontSize: 16,
  },
  balanceAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  balanceAmountText: {
    fontSize: 32,
    fontWeight: '600',
  },
  balanceDecimals: {
    fontSize: 18,
    opacity: 0.8,
    marginBottom: 5,
  },
  visibilityButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    opacity: 0.5,
    marginVertical: 'auto',
  },
  balanceButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  balanceButtonContainer: {
    flexDirection: 'column',
    gap: 5,
    alignItems: 'center',
  },
  primaryButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  secondaryButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  balanceButtonText: {
    fontSize: 12,
  },
});

export default BalanceCard;
