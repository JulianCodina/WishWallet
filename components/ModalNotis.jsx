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

// Imagenes
import noResult from '../public/noresult.png';

function Notificaciones({ isVisible, setOpen }) {
  const { loading, tema, colors, cambiarTema, limpiarStorage, gastos } =
    useAppContext();

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
              styles.notiHeader,
              {
                backgroundColor: colors.card,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => setOpen(false)}
            >
              <Icon name="arrow-back" size={25} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.notiHeaderText, { color: colors.text }]}>
              Notificaciones
            </Text>
          </View>
          {gastos
            .filter(item => item.result === 'profit')
            .filter(item => {
              const fecha = new Date(item.fecha);
              const tresDiasAtras = new Date();
              tresDiasAtras.setDate(tresDiasAtras.getDate() - 3); // ultimos 3 dias
              return fecha >= tresDiasAtras;
            }).length === 0 ? (
            <View
              style={[
                styles.notiList,
                { marginTop: '40%', alignItems: 'center' },
              ]}
            >
              <Image
                source={noResult}
                style={{ width: 200, height: 200 }}
                resizeMode="contain"
                opacity={0.5}
              />
              <Text style={[styles.itemLabel, { color: colors.label }]}>
                No hay notificaciones aún.
              </Text>
            </View>
          ) : (
            <FlatList
              style={styles.notiList}
              data={gastos
                .filter(item => item.result === 'profit')
                .filter(item => {
                  const fecha = new Date(item.fecha);
                  const tresDiasAtras = new Date();
                  tresDiasAtras.setDate(tresDiasAtras.getDate() - 3); // ultimos 3 dias
                  return fecha >= tresDiasAtras;
                })}
              renderItem={({ item }) => (
                <View style={[styles.item, { borderColor: colors.border }]}>
                  <Icon name="attach-money" size={40} color={colors.label} />
                  <View>
                    <View style={styles.itemHeader}>
                      <Text style={[styles.itemTitle, { color: colors.text }]}>
                        Recibiste ${item.monto}
                      </Text>
                      <Text style={[{ color: colors.label }]}>
                        {new Date(item.fecha).toLocaleDateString('es-AR', {
                          day: '2-digit',
                          month: '2-digit',
                        })}
                      </Text>
                    </View>
                    <Text style={[styles.itemLabel, { color: colors.label }]}>
                      Por {item.descripcion}
                    </Text>
                  </View>
                </View>
              )}
              keyExtractor={item => item.id}
            />
          )}
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
  notiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 20,
    borderBottomWidth: 1,
  },
  notiHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    gap: 10,
  },
  notiList: {
    flex: 1,
    margin: 20,
  },
  item: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 20,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemLabel: {
    fontSize: 16,
  },
});

export default Notificaciones;
