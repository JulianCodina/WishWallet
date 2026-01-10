import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Modal,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Pressable,
} from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import Clipboard from '@react-native-clipboard/clipboard';

// Iconos
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

// Datos de tarjeta
const Tdatos = {
  numero: '2424 4321 3412 1234',
  titulo: 'Dream Wallet User',
  vencimiento: '12/29',
  cvv: '123',
  direccion: 'Calle 123, Resistencia',
  tipo: 'VISA Debito',
};

function ModalTarjeta({ isVisible, setOpen }) {
  const { colors } = useAppContext();
  const [showData, setShowData] = useState(false);

  const handleCopy = element => {
    if (element == 'numero') {
      Alert.alert('Copiado', 'Número de tarjeta copiado al portapapeles');
      Clipboard.setString(Tdatos.numero);
    } else {
      Alert.alert('Copiado', 'Datos de tarjeta copiados al portapapeles');
      Clipboard.setString(
        'Datos tarjeta Dream Wallet \n Titular: ' +
          Tdatos.titulo +
          ' \n Numero: ' +
          Tdatos.numero +
          ' \n Vencimiento: ' +
          Tdatos.vencimiento +
          ' \n CVV: ' +
          Tdatos.cvv +
          ' \n Tipo: ' +
          Tdatos.tipo +
          ' \n Direccion: ' +
          Tdatos.direccion,
      );
    }
  };

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

          <View style={styles.content}>
            <Text style={[styles.subtitle, { color: colors.label }]}>
              Revisa y comparte la información de tu tarjeta de forma segura
              cuando lo necesites.
            </Text>

            <LinearGradient
              colors={[colors.primary, '#14a2b2ff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardContainer}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.contrast }]}>
                  Dream Wallet
                </Text>
                <Icon name="verified-user" size={20} color={colors.contrast} />
              </View>

              <Pressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}
                onPress={() => handleCopy('numero')}
              >
                {showData ? (
                  <Text style={[styles.cardNumber, { color: colors.contrast }]}>
                    {Tdatos.numero}
                  </Text>
                ) : (
                  <Text style={[styles.cardNumber, { color: colors.contrast }]}>
                    •••• •••• •••• {Tdatos.numero.slice(-4)}
                  </Text>
                )}
                <Icon name="content-copy" size={15} color={colors.contrast} />
              </Pressable>

              <View style={styles.cardFooter}>
                <View>
                  <Text style={[styles.cardLabel, { color: colors.contrast }]}>
                    Titular
                  </Text>
                  <Text style={[styles.cardValue, { color: colors.contrast }]}>
                    {Tdatos.titulo}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.cardLabel, { color: colors.contrast }]}>
                    Vence
                  </Text>
                  <Text style={[styles.cardValue, { color: colors.contrast }]}>
                    {Tdatos.vencimiento}
                  </Text>
                </View>
                <Icon
                  name="content-copy"
                  size={20}
                  color={colors.contrast}
                  onPress={() => handleCopy('data')}
                />
              </View>
            </LinearGradient>

            <View style={styles.infoRow}>
              <View style={[styles.infoBox, { backgroundColor: colors.card }]}>
                <Text style={[styles.infoLabel, { color: colors.label }]}>
                  CVV
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {showData ? Tdatos.cvv : '•••'}
                </Text>
              </View>

              <View style={[styles.infoBox, { backgroundColor: colors.card }]}>
                <Text style={[styles.infoLabel, { color: colors.label }]}>
                  Tipo
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {Tdatos.tipo}
                </Text>
              </View>
            </View>

            <View style={[styles.addressBox, { backgroundColor: colors.card }]}>
              <Text style={[styles.infoLabel, { color: colors.label }]}>
                Dirección de facturación
              </Text>
              <Text style={[styles.addressValue, { color: colors.text }]}>
                {Tdatos.direccion}
              </Text>
            </View>

            <Text style={[styles.securityNotice, { color: colors.label }]}>
              Comparte estos detalles solo con servicios en los que confíes.
              Para tu seguridad, nunca mostramos tu código de seguridad
              completo.
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.closeButton,
                  {
                    backgroundColor: colors.secondary,
                    borderColor: colors.primary,
                  },
                ]}
                activeOpacity={0.7}
                onPress={() => setOpen(false)}
              >
                <Text
                  style={[styles.closeButtonText, { color: colors.primary }]}
                >
                  Cerrar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.seeDataButton,
                  { backgroundColor: colors.primary },
                ]}
                activeOpacity={0.7}
                onPress={() => setShowData(!showData)}
              >
                <Icon name="visibility" size={20} color={colors.contrast} />
                <Text
                  style={[styles.seeDataButtonText, { color: colors.contrast }]}
                >
                  {showData ? 'Ocultar datos' : 'Ver datos'}
                </Text>
              </TouchableOpacity>
            </View>
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
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  cardContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardNumber: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 2,
  },
  cardFooter: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  infoBox: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  addressBox: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  addressValue: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 4,
  },
  securityNotice: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 'auto',
  },
  closeButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  seeDataButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  seeDataButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ModalTarjeta;
