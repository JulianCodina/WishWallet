import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppContext } from '../contexts/AppContext';

export const showAlerta = (type, title, message) => {
  Toast.show({
    type,
    text1: title,
    text2: message,
    visibilityTime: 4000,
    autoHide: true,
  });
};

function Alerta() {
  const { colors } = useAppContext();

  const getAlertStyles = type => {
    const baseStyle = {
      width: '95%',
      padding: 16,
      borderRadius: 8,
      marginVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    };

    switch (type) {
      case 'error':
        return { ...baseStyle, backgroundColor: colors.error };
      case 'warning':
        return { ...baseStyle, backgroundColor: colors.warning };
      case 'info':
        return { ...baseStyle, backgroundColor: colors.info };
      case 'success':
      default:
        return { ...baseStyle, backgroundColor: colors.success };
    }
  };

  const getTextColor = type => {
    switch (type) {
      case 'error':
        return colors.errorText;
      case 'warning':
        return colors.warningText;
      case 'info':
        return colors.infoText;
      case 'success':
      default:
        return colors.successText;
    }
  };

  const getIconName = type => {
    switch (type) {
      case 'error':
        return 'error-outline';
      case 'warning':
        return 'warning-amber';
      case 'info':
        return 'info-outline';
      case 'success':
      default:
        return 'check-circle-outline';
    }
  };

  const getIconColor = type => {
    switch (type) {
      case 'error':
        return colors.errorText;
      case 'warning':
        return colors.warningText;
      case 'info':
        return colors.infoText;
      case 'success':
      default:
        return colors.successText;
    }
  };

  const renderToast = ({ type, text1, text2, props }) => {
    const textColor = getTextColor(type);

    const handleClose = () => {
      if (props && typeof props.hide === 'function') {
        props.hide();
      }
    };

    return (
      <View style={getAlertStyles(type)}>
        <View style={styles.iconContainer}>
          <Icon name={getIconName(type)} size={24} color={getIconColor(type)} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: textColor }]}>{text1}</Text>
          <Text style={[styles.message, { color: textColor }]}>{text2}</Text>
        </View>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Icon name="close" size={20} color={textColor} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Toast
      position="top"
      config={{
        success: props => renderToast({ ...props, type: 'success', props }),
        error: props => renderToast({ ...props, type: 'error', props }),
        warning: props => renderToast({ ...props, type: 'warning', props }),
        info: props => renderToast({ ...props, type: 'info', props }),
      }}
      swipeable={true}
      swipeDirection="up"
      topOffset={50}
    />
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    opacity: 0.9,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default Alerta;
