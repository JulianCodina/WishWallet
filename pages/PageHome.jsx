import { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import BalanceCard from '../components/CardBalance';
import Ofertas from '../components/SectionOfertas';
import Interes from '../components/CardInteres';
import GraphCard from '../components/CardGraphics';
import Notificaciones from '../components/ModalNotis';
import Tarjeta from '../components/ModalTarjeta';
import CardHistorial from '../components/CardHistorial';
import LinearGradient from 'react-native-linear-gradient';
import { useAppContext } from '../contexts/AppContext';

function PageHome({ isOpenNotis, setIsOpenNotis }) {
  const { colors } = useAppContext();
  const [isOpenTarjeta, setIsOpenTarjeta] = useState(false);

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
        <Tarjeta isVisible={isOpenTarjeta} setOpen={setIsOpenTarjeta} />
        <BalanceCard setOpen={setIsOpenTarjeta} />
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
