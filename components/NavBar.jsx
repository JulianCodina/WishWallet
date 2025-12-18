import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useAppContext } from '../contexts/AppContext';

import Icon from 'react-native-vector-icons/MaterialIcons';

const NavBar = () => {
  const { colors } = useAppContext();
  const [activeTab, setActiveTab] = useState('home');

  const styles = StyleSheet.create({
    navbar: {
      backgroundColor: colors.card,
      borderTopColor: colors.border,
      borderTopWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 8,
      gap: 10,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      elevation: 10,
    },
    navItem: {
      alignItems: 'center',
      paddingVertical: 8,
      borderRadius: 8,
      flexGrow: 1,
    },
    navText: {
      color: colors.label,
      marginTop: 4,
      fontSize: 12,
    },
    selectedItem: {
      backgroundColor: colors.secondary,
    },
    selectedText: {
      color: colors.primary,
      fontWeight: 600,
    },
  });

  const handleHomePress = () => {
    setActiveTab('home');
  };

  const handleHistoryPress = () => {
    setActiveTab('history');
  };

  const handleStatsPress = () => {
    setActiveTab('statistics');
  };
  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={[styles.navItem, activeTab === 'home' && styles.selectedItem]}
        onPress={handleHomePress}
      >
        <Icon
          name="home"
          size={25}
          color={activeTab === 'home' ? colors.primary : colors.label}
        />
        <Text
          style={[styles.navText, activeTab === 'home' && styles.selectedText]}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, activeTab === 'history' && styles.selectedItem]}
        onPress={handleHistoryPress}
      >
        <Icon
          name="history"
          size={25}
          color={activeTab === 'history' ? colors.primary : colors.label}
        />
        <Text
          style={[
            styles.navText,
            activeTab === 'history' && styles.selectedText,
          ]}
        >
          History
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.navItem,
          activeTab === 'statistics' && styles.selectedItem,
        ]}
        onPress={handleStatsPress}
      >
        <Icon
          name="bar-chart"
          size={25}
          color={activeTab === 'statistics' ? colors.primary : colors.label}
        />
        <Text
          style={[
            styles.navText,
            activeTab === 'statistics' && styles.selectedText,
          ]}
        >
          Stats
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NavBar;
