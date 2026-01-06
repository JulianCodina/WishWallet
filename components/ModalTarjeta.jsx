import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Modal,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useAppContext } from '../contexts/AppContext';

// Iconos
import Icon from 'react-native-vector-icons/MaterialIcons';

function ModalTarjeta({ isVisible, setOpen }) {
  const { colors, gastos } = useAppContext();

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setOpen(false)}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <View
            style={[
              styles.Header,
              {
                backgroundColor: colors.card,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setOpen(false)}
            >
              <Icon name="arrow-back" size={25} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.HeaderText, { color: colors.text }]}>
              Tu Tarjeta
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',
    height: '100%',
  },
  Header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 20,
    borderBottomWidth: 1,
  },
  HeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    gap: 10,
  },
});

export default ModalTarjeta;
