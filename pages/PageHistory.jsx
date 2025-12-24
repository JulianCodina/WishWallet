import { StyleSheet, ScrollView } from 'react-native';
import CardHistorial from '../components/CardHistorial';
import LinearGradient from 'react-native-linear-gradient';
import { useAppContext } from '../contexts/AppContext';

function PageHistory() {
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
        <CardHistorial type={'complete'} />
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

export default PageHistory;
