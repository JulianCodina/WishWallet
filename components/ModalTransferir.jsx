import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  BackHandler,
  TouchableWithoutFeedback,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const ModalTranferir = ({ isVisible, onClose, onConfirm, balance, colors }) => {
  const [step, setStep] = useState(1); // 1: Alias/CVU, 2: Confirmar datos, 3: Monto
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [alias, setAlias] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [recentContacts, setRecentContacts] = useState([
    { id: '1', alias: 'juan.perez', name: 'Juan Pérez', cuit: '20-12345678-9' },
    {
      id: '2',
      alias: 'maria.gomez',
      name: 'María Gómez',
      cuit: '27-98765432-1',
    },
    {
      id: '3',
      alias: 'carlos.lopez',
      name: 'Carlos López',
      cuit: '23-45678901-2',
    },
    {
      id: '4',
      alias: 'julian.codina',
      name: 'Julián Codina',
      cuit: '20-45371200-2',
    },
  ]);
  const transferReasons = [
    'Varios',
    'Pago de servicios',
    'Préstamo',
    'Regalo',
    'Devolución',
  ];

  const handleNumericInput = text => {
    // Similar al de ModalIngresar pero sin el símbolo $
    if (text === '.') {
      setAmount('0.');
      return;
    }
    if (/^0[0-9]*$/.test(text)) {
      const newValue = text.slice(-1);
      setAmount(newValue);
      return;
    }
    const numericValue = text
      .replace(/,/g, '.')
      .replace(/[^0-9.]/g, '')
      .replace(/(\..*)\./g, '$1');

    const numberValue = numericValue === '' ? '' : parseFloat(numericValue);

    if (
      numericValue === '' ||
      (Number.isFinite(numberValue) && numberValue >= 0)
    ) {
      setAmount(numericValue);
    }
  };

  const handleContinue = () => {
    if (step === 1 && alias.trim() !== '') {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3 && amount && reason) {
      // Llamamos a onConfirm con los datos de la transferencia
      const transferData = {
        amount: parseFloat(amount),
        reason,
        recipient: recentContacts.find(c => c.alias === alias)?.name || alias,
        date: new Date().toISOString(),
      };

      try {
        // Llamamos a la función onConfirm que viene del componente padre
        onConfirm(transferData);

        // Reseteamos el formulario
        setAlias('');
        setAmount('');
        setReason('Varios');
        setStep(1);

        // Cerramos el modal
        onClose();
      } catch (error) {
        console.error('Error al procesar la transferencia:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    }
  };

  const handleContactSelect = contact => {
    setAlias(contact.alias);
    // Si selecciona un contacto, saltamos directamente al paso 3
    setStep(3);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={{ flex: 1 }}>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: isInputFocused ? colors.primary : colors.border,
                  backgroundColor: colors.background,
                },
              ]}
              placeholder="Alias o CVU"
              placeholderTextColor={colors.label}
              value={alias}
              onChangeText={setAlias}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
            />

            <Text
              style={[
                styles.sectionTitle,
                { color: colors.text, marginTop: 10 },
              ]}
            >
              Recientes
            </Text>

            <View style={{ flex: 1 }}>
              <FlatList
                data={recentContacts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.contactItem,
                      {
                        paddingVertical: 5,
                      },
                    ]}
                    onPressIn={() => {
                      return false;
                    }}
                    onPress={() => {
                      handleContactSelect(item);
                    }}
                  >
                    <Text
                      style={[styles.contactAlias, { color: colors.primary }]}
                    >
                      {item.alias}
                    </Text>
                    <Text style={{ color: colors.text }}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                style={styles.contactList}
              />
            </View>
          </View>
        );

      case 2:
        return (
          <>
            <View style={styles.infoContainer}>
              <Text style={[styles.infoLabel, { color: colors.label }]}>
                Alias:
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                juan.carlos
              </Text>

              <Text
                style={[
                  styles.infoLabel,
                  { color: colors.label, marginTop: 10 },
                ]}
              >
                Nombre completo:
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                Juan Carlos Pérez
              </Text>

              <Text
                style={[
                  styles.infoLabel,
                  { color: colors.label, marginTop: 10 },
                ]}
              >
                CUIT/CUIL:
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                20-12345678-9
              </Text>
            </View>
          </>
        );

      case 3:
        return (
          <>
            <Text
              style={[
                styles.stepTitle,
                { color: colors.text, textAlign: 'left' },
              ]}
            >
              {recentContacts.find(c => c.alias === alias)?.name || alias}
            </Text>

            <Text
              style={[
                styles.sectionTitle,
                { color: colors.text, marginTop: 10 },
              ]}
            >
              Monto
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                },
              ]}
              placeholder="$"
              placeholderTextColor={colors.label}
              value={amount}
              onChangeText={handleNumericInput}
              keyboardType="decimal-pad"
              autoFocus
            />

            <Text style={[styles.balanceText, { color: colors.label }]}>
              Saldo disponible: ${parseFloat(balance || 0).toFixed(2)}
            </Text>

            <Text
              style={[
                styles.sectionTitle,
                { color: colors.text, marginTop: 10 },
              ]}
            >
              Motivo
            </Text>

            <View
              style={[
                styles.pickerContainer,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                },
              ]}
            >
              <Picker
                selectedValue={reason}
                onValueChange={itemValue => setReason(itemValue)}
                style={{ color: colors.text }}
                dropdownIconColor={colors.text}
              >
                <Picker.Item label="Seleccionar motivo" value="" />
                {transferReasons.map((item, index) => (
                  <Picker.Item key={index} label={item} value={item} />
                ))}
              </Picker>
            </View>
          </>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    const backAction = () => {
      if (isVisible) {
        if (step > 1) {
          setStep(step - 1);
          return true;
        } else {
          onClose();
          return true;
        }
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [isVisible, onClose, step]);

  useEffect(() => {
    setReason('Varios');
  }, []);

  if (!isVisible) return null;

  return (
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
          {step === 1
            ? 'Transferir dinero'
            : step === 2
            ? 'Confirmar datos'
            : 'Monto a transferir'}
        </Text>

        {renderStep()}

        <View style={styles.modalButtons}>
          {step === 1 ? (
            <Pressable
              style={[
                styles.modalButton,
                { marginRight: 10, borderColor: colors.primary },
              ]}
              onPress={onClose}
            >
              <Text style={{ color: colors.primary }}>Cancelar</Text>
            </Pressable>
          ) : (
            <Pressable
              style={[
                styles.modalButton,
                { marginRight: 10, borderColor: colors.primary },
              ]}
              onPress={() => setStep(step - 1)}
            >
              <Text style={{ color: colors.primary }}>
                {step === 2 ? 'Cambiar alias' : 'Atrás'}
              </Text>
            </Pressable>
          )}

          <Pressable
            style={[
              styles.modalButton,
              {
                backgroundColor:
                  (step === 1 && alias.trim() === '') ||
                  (step === 3 && (!amount || !reason))
                    ? `${colors.primary}80`
                    : colors.primary,
              },
            ]}
            onPress={handleContinue}
            disabled={
              (step === 1 && alias.trim() === '') ||
              (step === 3 && (!amount || !reason))
            }
          >
            <Text style={{ color: colors.contrast }}>
              {step === 2
                ? 'Continuar'
                : step === 3
                ? 'Confirmar'
                : 'Continuar'}
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: '90%',
    maxHeight: '90%',
    minHeight: '50%',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 'auto',
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
  contactAlias: {
    fontWeight: '600',
    marginBottom: 4,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  balanceText: {
    textAlign: 'right',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
});

export default ModalTranferir;
