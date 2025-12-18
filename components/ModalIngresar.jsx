import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import { useAppContext } from '../contexts/AppContext';

function ModalIngresar({
  isVisible,
  setOpen,
  onClose,
  onConfirm,
  value,
  setValue,
}) {
  const { colors } = useAppContext();

  const inputRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      const t = setTimeout(() => {
        inputRef.current?.focus?.();
      }, 300); // Forzar focus porque anda raro

      return () => clearTimeout(t);
    }
  }, [isVisible]);

  const handleNumericInput = text => {
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

    if (
      numericValue === '' ||
      (Number.isFinite(numberValue) &&
        numberValue >= 0 &&
        numberValue <= 9999999)
    ) {
      setValue(numericValue);
    }
  };

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
            Ingresar monto
          </Text>

          <TextInput
            ref={inputRef}
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
            autoFocus={true}
          />

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
              activeOpacity={0.6}
            >
              <Text
                style={{
                  color: colors.primary,
                }}
              >
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalButton,
                {
                  backgroundColor:
                    value > 0 ? colors.primary : `${colors.primary}80`,
                },
              ]}
              onPress={onConfirm}
              activeOpacity={0.6}
              disabled={value <= 0}
            >
              <Text style={{ color: colors.contrast, fontWeight: 'bold' }}>
                Confirmar
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
    marginBottom: 15,
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
    borderWidth: 1,
    borderColor: 'transparent',
  },
});

export default ModalIngresar;
