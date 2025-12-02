import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  TouchableWithoutFeedback,
  Modal,
  Platform,
  KeyboardAvoidingView,
  Alert,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppContext } from '../contexts/AppContext';

const ModalAlias = ({ isVisible, onClose }) => {
  const { colors, userData, cambiarAlias } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [alias, setAlias] = useState(userData?.alias || '');

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

  const copyToClipboard = text => {
    Alert.alert('Copiado', 'Texto copiado al portapapeles');
  };

  const handleSaveAlias = () => {
    cambiarAlias(alias);
    setIsEditing(false);
  };

  if (!isVisible) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
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
                <Pressable onPress={onClose} style={styles.closeButton}>
                  <Icon name="close" size={24} color={colors.text} />
                </Pressable>
              </View>

              <View style={styles.section}>
                <Text style={[styles.subtitle, { color: colors.label }]}>
                  Alias
                </Text>
                <View style={styles.row}>
                  {isEditing ? (
                    <View style={styles.editContainer}>
                      <TextInput
                        style={[styles.input, { color: colors.text, flex: 1 }]}
                        value={alias}
                        onChangeText={setAlias}
                        autoFocus
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
                  <Text style={[styles.text, { color: colors.text, flex: 1 }]}>
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
                  onPress={() => {}}
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
                  onPress={() => {}}
                >
                  <Text
                    style={[styles.actionButtonText, { color: colors.primary }]}
                  >
                    Imprimir CVU
                  </Text>
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    marginVertical: 8,
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
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingRight: 8,
  },
  input: {
    height: 40,
    fontSize: 16,
    paddingVertical: 8,
  },
});

export default ModalAlias;
