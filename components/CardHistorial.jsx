import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import { useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/MaterialIcons';

// Imagenes
import noResult from '../public/noresult.png';

function CardHistorial({ type }) {
  const { gastos, colors, setActiveTab } = useAppContext();
  const [displayGastos, setDisplayGastos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    if (gastos && Array.isArray(gastos)) {
      if (type == 'simple') {
        setDisplayGastos(gastos.slice(-5).reverse());
      } else {
        setDisplayGastos(gastos);
      }
    }
  }, [gastos]);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.header, { display: type == 'simple' ? 'flex' : 'none' }]}
        onPress={() => {
          setActiveTab('history');
          navigation.reset({
            index: 0,
            routes: [{ name: 'History' }],
          });
        }}
      >
        <Text style={[styles.sectionTitle, { color: colors.label }]}>
          Ultimos movimientos
        </Text>
        <Text
          style={[
            styles.verMas,
            {
              color: colors.primary,
            },
          ]}
        >
          Ver más
        </Text>
      </TouchableOpacity>
      <View
        style={[
          styles.container,
          { marginTop: displayGastos.length > 0 ? 10 : 0 },
        ]}
      >
        {displayGastos.length > 0 ? (
          displayGastos.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[styles.item, { borderColor: colors.border }]}
              activeOpacity={0.7}
              onPress={() => {
                setSelectedTransaction(item);
                setModalVisible(true);
              }}
            >
              <Icon
                name={
                  item.result == 'profit'
                    ? 'arrow-downward'
                    : item.result == 'success'
                    ? 'call-made'
                    : 'money-off'
                }
                size={35}
                color={colors.label}
              />
              <View style={styles.itemContent}>
                <View style={styles.itemHeader}>
                  <Text style={[styles.itemTitle, { color: colors.text }]}>
                    {item.result == 'profit'
                      ? 'Ingreso de ' + item.origen
                      : item.result == 'success'
                      ? 'Pago a ' + item.origen
                      : 'Pago rechazado'}
                  </Text>
                  <Text
                    style={[
                      styles.itemTitle,
                      { color: colors.text },
                      item.result == 'error' && {
                        textDecorationLine: 'line-through',
                      },
                    ]}
                  >
                    {item.result == 'profit'
                      ? '+$' + item.monto
                      : item.result == 'success'
                      ? '-$' + item.monto
                      : '$' + item.monto}
                  </Text>
                </View>
                <View style={styles.itemHeader}>
                  <Text style={[{ color: colors.label }]}>
                    Por {item.descripcion}
                  </Text>
                  <Text style={[{ color: colors.label }]}>
                    {new Date(item.fecha).toLocaleTimeString('es-AR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={{ color: colors.label }}>
              No hay movimientos recientes
            </Text>
          </View>
        )}
      </View>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.darkness} />
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>

          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.label }]}>
                Detalles de transacción
              </Text>
            </View>

            {selectedTransaction && (
              <View style={styles.modalBody}>
                <View style={styles.amountContainer}>
                  <Text style={[styles.amount, { color: colors.text }]}>
                    $
                    {parseFloat(selectedTransaction.monto) % 1 === 0
                      ? parseFloat(selectedTransaction.monto)
                      : parseFloat(selectedTransaction.monto).toFixed(2)}
                  </Text>
                  <View style={[styles.statusBadge]}>
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            selectedTransaction.result === 'success'
                              ? '#2196F3'
                              : selectedTransaction.result === 'profit'
                              ? '#4CAF50'
                              : '#F44336',
                        },
                      ]}
                    >
                      {selectedTransaction.result === 'success'
                        ? 'Completado'
                        : selectedTransaction.result === 'profit'
                        ? 'Ingreso'
                        : 'Rechazado'}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.detailRow,
                    { borderBottomColor: colors.border },
                  ]}
                >
                  <Text style={[styles.detailLabel, { color: colors.label }]}>
                    Categoría
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {selectedTransaction.categoria}
                  </Text>
                </View>

                <View
                  style={[
                    styles.detailRow,
                    { borderBottomColor: colors.border },
                  ]}
                >
                  <Text style={[styles.detailLabel, { color: colors.label }]}>
                    Descripción
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {selectedTransaction.descripcion}
                  </Text>
                </View>

                <View
                  style={[
                    styles.detailRow,
                    { borderBottomColor: colors.border },
                  ]}
                >
                  <Text style={[styles.detailLabel, { color: colors.label }]}>
                    Origen/Destino
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {selectedTransaction.origen}
                  </Text>
                </View>

                <View
                  style={[
                    styles.detailRow,
                    { borderBottomColor: colors.border },
                  ]}
                >
                  <Text style={[styles.detailLabel, { color: colors.label }]}>
                    Fecha
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {new Date(selectedTransaction.fecha).toLocaleString(
                      'es-AR',
                      {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      },
                    )}
                  </Text>
                </View>

                <View
                  style={[
                    styles.detailRow,
                    { borderBottomColor: colors.border },
                  ]}
                >
                  <Text style={[styles.detailLabel, { color: colors.label }]}>
                    ID de transacción
                  </Text>
                  <Text
                    style={[
                      styles.detailValue,
                      { color: colors.text, fontSize: 12 },
                    ]}
                  >
                    {selectedTransaction.id}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderBottomWidth: 3,
  },
  container: {
    paddingHorizontal: 15,
    height: 'auto',
  },
  header: {
    marginTop: 15,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    opacity: 0.8,
  },
  verMas: {
    fontSize: 15,
  },
  list: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    alignItems: 'center',
    zIndex: 2000,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '98%',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  itemLabel: {
    fontSize: 12,
  },
  noDataContainer: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 64,
    alignItems: 'center',
    padding: 15,
    zIndex: 2,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
  },
  darkness: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  modalContent: {
    maxHeight: '70%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 25,
    borderWidth: 1,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '500',
  },
  modalBody: {
    flex: 1,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'center',
  },
  statusText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 100,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
    maxWidth: '60%',
  },
});

export default CardHistorial;
