import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, BackHandler } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppContext } from '../contexts/AppContext';
import GraphCard from '../components/CardGraphics';

import { useNavigation } from '@react-navigation/native';

function PageStatistics() {
  const { colors, setActiveTab } = useAppContext();

  const navigation = useNavigation();

  useEffect(() => {
    const backAction = () => {
      setActiveTab('home');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation, setActiveTab]);

  return (
    <LinearGradient
      colors={[colors.secondary, colors.background, colors.background]}
      locations={[0, 0.3, 1]}
      style={styles.page}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <GraphCard type={'complete'} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingBottom: 70,
  },
});

export default PageStatistics;
