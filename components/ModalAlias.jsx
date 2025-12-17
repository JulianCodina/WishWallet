import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Alert,
  Share,
  Modal,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import RNPrint from 'react-native-print';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppContext } from '../contexts/AppContext';
import { showAlerta } from './Alerta';

function ModalAlias({ isVisible, setOpen }) {
  const { colors, userData, cambiarAlias } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [alias, setAlias] = useState(userData?.alias || '');

  const copyToClipboard = text => {
    Alert.alert('Copiado', 'Texto copiado al portapapeles');
    Clipboard.setString(text);
  };

  const handleSaveAlias = () => {
    if (alias.trim() === '') {
      Alert.alert('Error', 'El alias no puede estar vacío');
      return;
    }
    cambiarAlias(alias);
    setIsEditing(false);
    showAlerta('success', 'Cambio hecho', 'Tu nuevo alias ya funciona.');
  };

  const onShare = async () => {
    try {
      const message = `Mi información de WishWallet:\n\nNombre: ${userData.userName}\nAlias: ${userData?.alias}\nCVU: ${userData?.cvu}`;

      const result = await Share.share({
        message: message,
        title: 'Compartir datos de WishWallet',
      });

      if (result.action === Share.sharedAction) {
        console.log('Contenido compartido exitosamente');
      } else if (result.action === Share.dismissedAction) {
        console.log('Compartir cancelado');
      }
    } catch (error) {
      console.error('Error al compartir:', error);
      Alert.alert('Error', 'No se pudo compartir la información');
    }
  };

  const onPrint = async () => {
    try {
      const html = `
      <html>
        <body style="padding: 20px; font-family: Arial;">
          <h1 style="color: #0066cc;margin: 30px 0">Wish Wallet</h1>
          <h2>Constancia de CVU</h2>

          <div style="margin: 20px 0; border: 1px solid #ccc; padding: 15px; border-radius: 10px;">
            <p><strong>Nombre:</strong> ${userData.userName}</p>
            <p><strong>Alias:</strong> ${userData.alias}</p>
            <p><strong>CVU:</strong> ${userData.cvu}</p>
            <p><strong>CUIL:</strong> ${userData.CUIL || 'No disponible'}</p>
          </div>

          <p style="text-align:center; font-size: 12px; color: #555;">
            Fecha: ${new Date().toLocaleDateString()}
          </p>
        </body>
      </html>
    `;
      const pdf = await RNPrint.print({ html });
      const result = await Share.share({
        title: 'Compartir constancia de CVU',
        url: pdf,
        type: 'application/pdf',
      });

      if (result.action === Share.sharedAction) {
        console.log('Compartido exitosamente');
      } else if (result.action === Share.dismissedAction) {
        console.log('Compartir cancelado');
      }
    } catch (error) {
      console.error('Error al imprimir', error);
      Alert.alert('Error', 'No se pudo imprimir el comprobante');
    }
  };

  useEffect(() => {
    setAlias(userData?.alias || '');
    setIsEditing(false);
  }, [userData?.alias]);

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setOpen(false)}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <KeyboardAvoidingView
                behavior="height"
                style={[styles.modalView, { backgroundColor: colors.card }]}
              >
                <View style={styles.header}>
                  <Text style={[styles.title, { color: colors.text }]}>
                    Tu Información
                  </Text>
                  <Pressable
                    onPress={() => setOpen(false)}
                    style={styles.closeButton}
                  >
                    <Icon name="close" size={24} color={colors.text} />
                  </Pressable>
                </View>

                <View style={styles.section}>
                  <Text style={[styles.subtitle, { color: colors.label }]}>
                    Alias
                  </Text>
                  <View style={styles.row}>
                    {isEditing ? (
                      <View
                        style={[
                          styles.editContainer,
                          { borderBottomColor: colors.text },
                        ]}
                      >
                        <TextInput
                          style={[
                            styles.input,
                            {
                              color: colors.text,
                              flex: 1,
                              borderBottomColor: colors.border,
                            },
                          ]}
                          value={alias}
                          onChangeText={setAlias}
                          autoFocus
                          placeholderTextColor={colors.label}
                        />
                        <Pressable
                          onPress={handleSaveAlias}
                          style={styles.iconButton}
                        >
                          <Icon name="check" size={20} color={colors.primary} />
                        </Pressable>
                      </View>
                    ) : (
                      <Text
                        style={[styles.text, { color: colors.text, flex: 1 }]}
                      >
                        {userData?.alias || 'No disponible'}
                      </Text>
                    )}
                    {!isEditing && (
                      <Pressable
                        onPress={() => setIsEditing(true)}
                        style={styles.iconButton}
                      >
                        <Icon name="edit" size={20} color={colors.primary} />
                      </Pressable>
                    )}
                    <Pressable
                      onPress={() => copyToClipboard(userData?.alias)}
                      style={styles.iconButton}
                    >
                      <Icon
                        name="content-copy"
                        size={20}
                        color={colors.primary}
                      />
                    </Pressable>
                  </View>
                </View>

                <View
                  style={[styles.divider, { backgroundColor: colors.border }]}
                />

                <View style={styles.section}>
                  <Text style={[styles.subtitle, { color: colors.label }]}>
                    CVU
                  </Text>
                  <View style={styles.row}>
                    <Text
                      style={[styles.text, { color: colors.text, flex: 1 }]}
                    >
                      {userData?.cvu || 'No disponible'}
                    </Text>
                    <Pressable
                      onPress={() => copyToClipboard(userData?.cvu)}
                      style={styles.iconButton}
                    >
                      <Icon
                        name="content-copy"
                        size={20}
                        color={colors.primary}
                      />
                    </Pressable>
                  </View>
                </View>

                <View style={styles.buttonContainer}>
                  <Pressable
                    style={[
                      styles.actionButton,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={onShare}
                  >
                    <Text
                      style={[
                        styles.actionButtonText,
                        { color: colors.contrast },
                      ]}
                    >
                      Compartir datos
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.actionButton,
                      { borderColor: colors.primary, borderWidth: 1 },
                    ]}
                    onPress={onPrint}
                  >
                    <Text
                      style={[
                        styles.actionButtonText,
                        { color: colors.primary },
                      ]}
                    >
                      Imprimir CVU
                    </Text>
                  </Pressable>
                </View>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
    marginRight: -8,
  },
  section: {
    width: '100%',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 0,
  },
  text: {
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionButtonText: {
    fontWeight: '500',
    fontSize: 14,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    borderBottomWidth: 1,
    paddingRight: 8,
  },
  input: {
    height: 40,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
});

export default ModalAlias;
