import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useAppContext } from '../contexts/AppContext';

import { useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/MaterialIcons';

const NavBar = () => {
  const { colors, activeTab, setActiveTab } = useAppContext();

  const navigation = useNavigation();

  const handleHomePress = () => {
    if (activeTab == 'home') {
      return;
    }
    setActiveTab('home');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  const handleHistoryPress = () => {
    if (activeTab == 'history') {
      return;
    }
    setActiveTab('history');
    navigation.reset({
      index: 0,
      routes: [{ name: 'History' }],
    });
  };

  const handleStatsPress = () => {
    if (activeTab == 'statistics') {
      return;
    }
    setActiveTab('statistics');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Statistics' }],
    });
  };
  return (
    <View
      style={[
        styles.navbar,
        {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.navItem,
          activeTab === 'home' && { backgroundColor: colors.secondary },
        ]}
        onPress={handleHomePress}
        activeOpacity={0.7}
      >
        <Icon
          name="home"
          size={25}
          color={activeTab === 'home' ? colors.primary : colors.label}
        />
        <Text
          style={[
            styles.navText,
            activeTab === 'home'
              ? { color: colors.primary }
              : { color: colors.label },
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.navItem,
          activeTab === 'history' && { backgroundColor: colors.secondary },
        ]}
        onPress={handleHistoryPress}
        activeOpacity={0.7}
      >
        <Icon
          name="history"
          size={25}
          color={activeTab === 'history' ? colors.primary : colors.label}
        />
        <Text
          style={[
            styles.navText,
            activeTab === 'history'
              ? { color: colors.primary }
              : { color: colors.label },
          ]}
        >
          History
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.navItem,
          activeTab === 'statistics' && { backgroundColor: colors.secondary },
        ]}
        onPress={handleStatsPress}
        activeOpacity={0.7}
      >
        <Icon
          name="bar-chart"
          size={25}
          color={activeTab === 'statistics' ? colors.primary : colors.label}
        />
        <Text
          style={[
            styles.navText,
            activeTab === 'statistics'
              ? { color: colors.primary }
              : { color: colors.label },
          ]}
        >
          Stats
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
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
    marginTop: 4,
    fontSize: 12,
  },
  selectedText: {
    fontWeight: 600,
  },
});

export default NavBar;
