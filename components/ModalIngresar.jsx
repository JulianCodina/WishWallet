import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  BackHandler,
  TouchableWithoutFeedback,
} from 'react-native';

const ModalIngresar = ({
  isVisible,
  onClose,
  onConfirm,
  balance,
  value,
  setValue,
  colors,
}) => {
  const handleNumericInput = (text, setValue) => {
    if (text === '.') {
      setValue('0.');
      return;
    }
    if (/^0[0-9]*$/.test(text)) {
      const newValue = text.slice(-1);
      setValue(newValue);
      return;
    }
    const numericValue = text
      .replace(/,/g, '.')
      .replace(/[^0-9.]/g, '')
      .replace(/(\..*)\./g, '$1');

    const numberValue = numericValue === '' ? '' : parseFloat(numericValue);
    const currentBalance = parseFloat(balance) || 0;

    if (
      numericValue === '' ||
      (Number.isFinite(numberValue) &&
        numberValue >= 0 &&
        numberValue <= 9999999)
    ) {
      setValue(numericValue);
    }
  };

  useEffect(() => {
    const backAction = () => {
      if (isVisible) {
        onClose();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [isVisible, onClose]);

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
          Ingresar monto
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
          placeholder="$0"
          placeholderTextColor={colors.label}
          value={value ? '$' + value : ''}
          onChangeText={text => handleNumericInput(text, setValue)}
          keyboardType="decimal-pad"
          autoFocus
        />

        <View style={styles.modalButtons}>
          <Pressable
            style={[
              styles.modalButton,
              { marginRight: 10, borderColor: colors.primary },
            ]}
            onPress={onClose}
          >
            <Text style={{ color: colors.primary, fontWeight: '500' }}>
              Cancelar
            </Text>
          </Pressable>

          <Pressable
            style={[styles.modalButton, { backgroundColor: colors.primary }]}
            onPress={onConfirm}
          >
            <Text style={{ color: colors.contrast, fontWeight: '500' }}>
              Aceptar
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
    width: '70%',
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
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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

export default ModalIngresar;
