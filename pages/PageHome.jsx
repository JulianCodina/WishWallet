import { StyleSheet, ScrollView } from 'react-native';
import BalanceCard from '../components/CardBalance';
import Ofertas from '../components/SectionOfertas';
import Interes from '../components/CardInteres';
import GraphCard from '../components/CardGraphics';
import Notificaciones from '../components/ModalNotis';
import CardHistorial from '../components/CardHistorial';
import LinearGradient from 'react-native-linear-gradient';
import { useAppContext } from '../contexts/AppContext';

function PageHome({ isOpenNotis, setIsOpenNotis }) {
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
        <Notificaciones isVisible={isOpenNotis} setOpen={setIsOpenNotis} />
        <BalanceCard />
        <Ofertas />
        <Interes />
        <GraphCard type={'simple'} />
        <CardHistorial type={'simple'} />
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

export default PageHome;
