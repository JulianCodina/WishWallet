import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ModalIngresar from './ModalIngresar';
import ModalTransferir from './ModalTransferir';
import ModalAlias from './ModalAlias';
import { useAppContext } from '../contexts/AppContext';
import { showAlerta } from './Alerta';

const BalanceCard = () => {
  const { loading, balance, colors, sumarBalance, restarBalance } =
    useAppContext();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isIngresarVisible, setIsIngresarVisible] = useState(false);
  const [isTransferirVisible, setIsTransferirVisible] = useState(false);
  const [isAliasVisible, setIsAliasVisible] = useState(false);
  const [monto, setMonto] = useState('');
  const [transferencia, setTransferencia] = useState('');

  const balanceEntero = Math.floor(balance);
  const centavos = Math.round((balance - balanceEntero) * 100)
    .toString()
    .padStart(2, '0');

  const handleIngresar = () => {
    if (monto > 0) {
      if (parseFloat(monto) + parseFloat(balance) > 9999999) {
        showAlerta('error', 'Error', 'Puede tener máximo $9.999.999');
      } else {
        console.log('Monto a ingresar:', monto);
        setMonto('');
        sumarBalance(monto);
        setIsIngresarVisible(false);
        showAlerta(
          'success',
          'Éxito',
          'La operación se completó correctamente.',
        );
      }
    }
  };

  const handleTransferir = transferData => {
    const { amount, reason, recipient } = transferData;
    const montoTransferencia = parseFloat(amount);

    if (montoTransferencia <= 0) {
      showAlerta('error', 'Error', 'El monto debe ser mayor a 0');
      return;
    }

    if (montoTransferencia > balance) {
      showAlerta('error', 'Error', 'Saldo insuficiente');
      return;
    }

    console.log(
      'Transferencia de $' +
        montoTransferencia +
        ' a ' +
        recipient +
        ' por ' +
        reason,
    );

    restarBalance(montoTransferencia);
    setIsTransferirVisible(false);

    showAlerta(
      'success',
      'Transferencia exitosa',
      `Se transfirió $${montoTransferencia.toFixed(2)} a ${
        recipient || 'el destinatario'
      }`,
    );
  };

  return (
    <>
      <View
        style={[
          styles.balanceCard,
          {
            backgroundColor: colors.card,
            borderWidth: 1,
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
                      ${balanceEntero}
                    </Text>
                    <Text
                      style={[styles.balanceDecimals, { color: colors.label }]}
                    >
                      .{centavos}
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
            <Pressable
              style={styles.visibilityButton}
              onPress={() => setIsBalanceVisible(!isBalanceVisible)}
            >
              <Icon
                name={isBalanceVisible ? 'visibility' : 'visibility-off'}
                size={20}
                color={colors.label}
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.balanceButtons}>
          <View style={styles.balanceButtonContainer}>
            <Pressable
              onPress={() => setIsIngresarVisible(true)}
              style={[
                styles.primaryButton,
                { backgroundColor: colors.primary },
              ]}
            >
              <Icon name="upload" size={25} color={colors.contrast} />
            </Pressable>
            <Text style={[styles.balanceButtonText, { color: colors.primary }]}>
              Ingresar
            </Text>
          </View>
          <View style={styles.balanceButtonContainer}>
            <Pressable
              style={[
                styles.primaryButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={() => setIsTransferirVisible(true)}
            >
              <Icon name="swap-horiz" size={25} color={colors.contrast} />
            </Pressable>
            <Text style={[styles.balanceButtonText, { color: colors.primary }]}>
              Transferir
            </Text>
          </View>
          <View style={styles.balanceButtonContainer}>
            <Pressable
              style={[
                styles.secondaryButton,
                { backgroundColor: colors.secondary },
              ]}
              onPress={() => setIsAliasVisible(true)}
            >
              <Icon name="text-snippet" size={25} color={colors.primary} />
            </Pressable>
            <Text style={[styles.balanceButtonText, { color: colors.primary }]}>
              Mi alias
            </Text>
          </View>
          <View style={styles.balanceButtonContainer}>
            <Pressable
              style={[
                styles.secondaryButton,
                { backgroundColor: colors.secondary },
              ]}
            >
              <Icon name="credit-card" size={25} color={colors.primary} />
            </Pressable>
            <Text style={[styles.balanceButtonText, { color: colors.primary }]}>
              Tarjeta
            </Text>
          </View>
        </View>
      </View>
      {isIngresarVisible && (
        <ModalIngresar
          isVisible={isIngresarVisible}
          onClose={() => {
            setIsIngresarVisible(false);
            setMonto('');
          }}
          onConfirm={handleIngresar}
          balance={balance}
          value={monto}
          setValue={setMonto}
          colors={colors}
        />
      )}
      {isTransferirVisible && (
        <ModalTransferir
          isVisible={isTransferirVisible}
          onClose={() => {
            setIsTransferirVisible(false);
            setTransferencia('');
          }}
          onConfirm={handleTransferir}
          balance={balance}
          value={transferencia}
          setValue={setTransferencia}
          colors={colors}
        />
      )}
      {isAliasVisible && (
        <ModalAlias
          isVisible={isAliasVisible}
          onClose={() => {
            setIsAliasVisible(false);
          }}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  balanceCard: {
    padding: 20,
    borderRadius: 16,
    margin: 20,
    gap: 10,
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
