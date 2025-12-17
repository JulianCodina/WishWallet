import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useAppContext } from '../contexts/AppContext';

function CardHistorial() {
  const { gastos, colors } = useAppContext();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: colors.label }]}>
          Ultimos movimientos
        </Text>
        <Text style={[styles.verMas, { color: colors.primary }]}>Ver más</Text>
      </View>
      <View style={styles.container}></View>
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
    padding: 15,
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
});

export default CardHistorial;
