import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppContext } from '../contexts/AppContext';

const sampleOffers = [
  {
    id: 1,
    title: '20% de descuento',
    description: 'En supermercados seleccionados',
    icon: 'shopping-cart',
    stores: ['Supermercado Central', 'Almacén Don Juan', 'La Anónima'],
    benefit: '20% de reintegro',
    cap: 'Tope: $5.000',
    expiry: '30/12/2023',
    color: '#4CAF50',
  },
  {
    id: 2,
    title: '3 cuotas sin interés',
    description: 'En electrónica y tecnología',
    icon: 'laptop',
    stores: ['Frávega', 'Musimundo', 'Cetrogar'],
    benefit: '3 cuotas sin interés',
    cap: 'Hasta $150.000',
    expiry: '15/01/2024',
    color: '#2196F3',
  },
  {
    id: 3,
    title: '15% de descuento',
    description: 'En restaurantes adheridos',
    icon: 'restaurant',
    stores: ['Mostaza', 'Burger King', 'Starbucks'],
    benefit: '15% de reintegro',
    cap: 'Tope: $2.000',
    expiry: '10/01/2024',
    color: '#FF9800',
  },
  {
    id: 4,
    title: '2x1 en cines',
    description: 'Todos los miércoles',
    icon: 'local-movies',
    stores: ['Cinemark', 'Hoyts', 'Village Cines'],
    benefit: '2x1 en entradas',
    cap: 'Válido para 2D',
    expiry: '31/12/2023',
    color: '#9C27B0',
  },
];

const Ofertas = () => {
  const { colors } = useAppContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const { width } = Dimensions.get('window');
  const cardWidth = width * 0.6;

  const styles = StyleSheet.create({
    container: {
      marginLeft: 10,
      marginVertical: 10,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      padding: 20,
    },
    modalContent: {
      borderRadius: 15,
      padding: 20,
      width: '100%',
      maxHeight: '80%',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 500,
      marginBottom: 15,
      paddingHorizontal: 5,
      opacity: 0.8,
    },
    scrollContainer: {
      paddingBottom: 10,
      marginHorizontal: 16,
    },
    card: {
      width: cardWidth,
      borderRadius: 15,
      padding: 20,
      marginRight: 15,
      borderWidth: 1,
    },
    cardTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 10,
    },
    iconContainer: {
      width: 30,
      height: 30,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    cardDescription: {
      fontSize: 15,
      lineHeight: 18,
    },
    modalHeader: {
      alignItems: 'center',
      marginBottom: 20,
    },
    modalIconContainer: {
      width: 70,
      height: 70,
      borderRadius: 35,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 15,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 5,
    },
    modalSubtitle: {
      fontSize: 16,
      color: colors.text,
      textAlign: 'center',
      opacity: 0.7,
    },
    detailSection: {
      marginBottom: 20,
    },
    detailTitle: {
      fontSize: 16,
      fontWeight: 500,
      color: colors.text,
      marginBottom: 5,
    },
    detailText: {
      fontSize: 15,
      color: colors.text,
      marginBottom: 3,
      lineHeight: 22,
      opacity: 0.7,
    },
    closeButton: {
      marginTop: 10,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
    },
    closeButtonText: {
      color: colors.contrast,
      fontSize: 16,
      fontWeight: '600',
    },
  });

  const handleCardPress = offer => {
    setSelectedOffer(offer);
    setModalVisible(true);
  };

  const onClose = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Ofertas Exclusivas
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {sampleOffers.map(offer => (
          <TouchableOpacity
            key={offer.id}
            style={[
              styles.card,
              {
                backgroundColor: `${offer.color}15`,
                borderColor: `${offer.color}40`,
              },
            ]}
            onPress={() => handleCardPress(offer)}
          >
            <View style={styles.cardTop}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${offer.color}30` },
                ]}
              >
                <Icon name={offer.icon} size={15} color={offer.color} />
              </View>
              <Text style={[styles.cardTitle, { color: offer.color }]}>
                {offer.title}
              </Text>
            </View>
            <Text
              style={[styles.cardDescription, { color: colors.text }]}
              numberOfLines={2}
            >
              {offer.description}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={onClose}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalContent,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                {selectedOffer && (
                  <>
                    <View style={styles.modalHeader}>
                      <View
                        style={[
                          styles.modalIconContainer,
                          { backgroundColor: `${selectedOffer.color}33` },
                        ]}
                      >
                        <Icon
                          name={selectedOffer.icon}
                          size={40}
                          color={selectedOffer.color}
                        />
                      </View>
                      <Text
                        style={[
                          styles.modalTitle,
                          { color: selectedOffer.color },
                        ]}
                      >
                        {selectedOffer.title}
                      </Text>
                      <Text style={styles.modalSubtitle}>
                        {selectedOffer.description}
                      </Text>
                    </View>

                    <View style={styles.detailSection}>
                      <Text style={styles.detailTitle}>Beneficio</Text>
                      <Text style={styles.detailText}>
                        {selectedOffer.benefit}
                      </Text>
                      <Text style={styles.detailText}>{selectedOffer.cap}</Text>
                    </View>

                    <View style={styles.detailSection}>
                      <Text style={styles.detailTitle}>
                        Tiendas participantes
                      </Text>
                      {selectedOffer.stores.map((store, index) => (
                        <Text key={index} style={styles.detailText}>
                          • {store}
                        </Text>
                      ))}
                    </View>

                    <View style={styles.detailSection}>
                      <Text style={styles.detailTitle}>Válido hasta</Text>
                      <Text style={styles.detailText}>
                        {selectedOffer.expiry}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.closeButton,
                        { backgroundColor: selectedOffer.color },
                      ]}
                      onPress={onClose}
                    >
                      <Text style={styles.closeButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default Ofertas;
