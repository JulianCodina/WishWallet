import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  FlatList,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppContext } from '../contexts/AppContext';

const PREDEFINED_CONTACTS = [
  { id: '1', alias: 'juan.perez', name: 'Juan Pérez', cuit: '20-12345678-9' },
  { id: '2', alias: 'maria.gomez', name: 'María Gómez', cuit: '27-98765432-1' },
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
  { id: '5', alias: 'ana.torres', name: 'Ana Torres', cuit: '27-12345678-3' },
  {
    id: '6',
    alias: 'pedro.gonzalez',
    name: 'Pedro González',
    cuit: '20-87654321-4',
  },
];

function ModalTranferir({ isVisible, setOpen, onClose, onConfirm }) {
  const { colors, balance, agregarGasto } = useAppContext();
  const [step, setStep] = useState(1); // 1: Alias/CVU, 2: Confirmar datos, 3: Monto
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [alias, setAlias] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('Varios');
  const [recentContacts, setRecentContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  const selectRandomContact = () => {
    const randomIndex = Math.floor(Math.random() * PREDEFINED_CONTACTS.length);
    return PREDEFINED_CONTACTS[randomIndex];
  };

  const transferReasons = [
    'Varios',
    'Pago de servicios',
    'Préstamo',
    'Regalo',
    'Devolución',
  ];

  const handleNumericInput = text => {
    let numericText = text.replace(/\$/g, '');

    if (numericText === '.') {
      setAmount('0.');
      return;
    }
    if (/^0[0-9]*$/.test(numericText)) {
      const newValue = numericText.slice(-1);
      setAmount(newValue);
      return;
    }
    const numericValue = numericText
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

  const handleContinue = async () => {
    if (step === 1 && alias.trim() !== '') {
      const randomContact = selectRandomContact();
      setSelectedContact(randomContact);
      setAlias('');
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3 && amount && reason) {
      if (!selectedContact) return;

      const transferData = {
        id: Date.now().toString(),
        descripcion: 'Tranferencia a contacto',
        origen: selectedContact.name,
        monto: parseFloat(amount),
        fecha: new Date().toISOString(),
        categoria: reason,
        result: 'success',
      };

      if (balance > transferData.monto) {
        try {
          const updatedContacts = [
            selectedContact,
            ...recentContacts.filter(c => c.id !== selectedContact.id),
          ].slice(0, 5);

          await AsyncStorage.setItem(
            'recentContacts',
            JSON.stringify(updatedContacts),
          );
          console.log('Contactos recientes actualizados');
          setRecentContacts(updatedContacts);
          agregarGasto(transferData);
        } catch (error) {
          console.error('Error al procesar la transferencia:', error);
        }
      }
      onConfirm(transferData);
      setAlias('');
      setAmount('');
      setReason('Varios');
      setSelectedContact(null);
      setStep(1);
      onClose();
    }
  };

  const handleContactSelect = contact => {
    setAlias(contact.alias);
    setSelectedContact(contact);
    setStep(3);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={{ flex: 1, width: '100%' }}>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: isInputFocused ? colors.primary : colors.border,
                  backgroundColor: colors.background,
                  width: '100%',
                  borderWidth: 1,
                  textAlign: 'left',
                  paddingVertical: 12,
                  paddingHorizontal: 15,
                  borderRadius: 8,
                  marginBottom: 15,
                },
              ]}
              placeholder="Ingresa un alias o CVU"
              placeholderTextColor={colors.label}
              value={alias}
              onChangeText={setAlias}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              onSubmitEditing={handleContinue}
              returnKeyType="next"
            />

            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.text, marginTop: 5, marginBottom: -5 },
                ]}
              >
                Contactos recientes
              </Text>

              {recentContacts.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={[styles.emptyText, { color: colors.label }]}>
                    No hay contactos recientes.
                  </Text>
                  <Text style={[styles.emptySubtext, { color: colors.label }]}>
                    Ingresa un alias para comenzar.
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={recentContacts}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.contactItem,
                        { borderBottomColor: colors.border },
                      ]}
                      onPress={() => handleContactSelect(item)}
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
              )}
            </View>
          </View>
        );

      case 2:
        return (
          <>
            <View style={styles.infoContainer}>
              {/* Espacio */}
              <View style={{ height: 10 }} />
              <Text style={[styles.infoLabel, { color: colors.label }]}>
                Alias:
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {selectedContact?.alias || ''}
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
                {selectedContact?.name || ''}
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
                {selectedContact?.cuit || ''}
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
              {selectedContact
                ? `¿Cuánto enviar a ${selectedContact.name}?`
                : 'Ingrese el monto a transferir'}
            </Text>

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
              value={amount ? '$' + amount : ''}
              onChangeText={handleNumericInput}
              keyboardType="decimal-pad"
              autoFocus
            />

            <Text style={[styles.balanceText, { color: colors.label }]}>
              Saldo disponible: $
              {parseFloat(balance || 0).toLocaleString('es-AR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>

            <View style={[styles.pickerContainer]}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.text, marginTop: 10, marginBottom: -5 },
                ]}
              >
                Seleccioná un motivo
              </Text>
              <Picker
                selectedValue={reason}
                onValueChange={itemValue => setReason(itemValue)}
                style={{ color: colors.text }}
                dropdownIconColor={colors.text}
              >
                <Picker.Item label="Seleccionar motivo" value="Varios" />
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
    const loadRecentContacts = async () => {
      try {
        const savedContacts = await AsyncStorage.getItem('recentContacts');
        console.log('Contactos recientes cargados:', savedContacts);
        if (savedContacts) {
          setRecentContacts(JSON.parse(savedContacts));
        }
      } catch (error) {
        console.error('Error al cargar contactos recientes:', error);
      }
    };
    loadRecentContacts();
    setReason('Varios');
  }, []);

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setOpen(false)}
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
            {step === 1
              ? 'Transferir dinero'
              : step === 2
              ? 'Confirmar datos'
              : 'Monto a transferir'}
          </Text>

          <View style={{ flexGrow: 1, width: '100%' }}>{renderStep()}</View>

          <View style={styles.modalButtons}>
            {step === 1 ? (
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
                activeOpacity={0.6}
              >
                <Text style={{ color: colors.primary }}>Cancelar</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {
                    marginRight: 10,
                    borderColor: colors.primary,
                    backgroundColor: colors.secondary,
                  },
                ]}
                onPress={() => setStep(step - 1)}
                activeOpacity={0.6}
              >
                <Text style={{ color: colors.primary, fontWeight: '500' }}>
                  {step === 2 ? 'Cambiar alias' : 'Atrás'}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
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
              activeOpacity={0.6}
              disabled={
                (step === 1 && alias.trim() === '') ||
                (step === 3 && (!amount || !reason))
              }
            >
              <Text style={{ color: colors.contrast, fontWeight: 'bold' }}>
                {step === 2
                  ? 'Continuar'
                  : step === 3
                  ? 'Confirmar'
                  : 'Continuar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  emptyContainer: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.8,
    textAlign: 'center',
  },
  contactItem: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    paddingHorizontal: 5,
  },
  contactList: {
    maxHeight: 200,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
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
    minHeight: '62%',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'column',
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
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 15,
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
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
});

export default ModalTranferir;
