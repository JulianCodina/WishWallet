import { StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppContext } from '../contexts/AppContext';
import GraphCard from '../components/CardGraphics';

function PageStatistics() {
  const { colors } = useAppContext();
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
        <GraphCard />
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
