import { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  Image,
} from 'react-native';
import CardHistorial from '../components/CardHistorial';
import LinearGradient from 'react-native-linear-gradient';
import { useAppContext } from '../contexts/AppContext';
import { useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import noResult from '../public/noresult.png';

const filtros = ['Transferencias', 'Pagos y Compras', 'Ingresos'];

function PageHistory() {
  const { colors, gastosPorFecha, setActiveTab } = useAppContext();
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState();
  const [gastos, setGastos] = useState(gastosPorFecha);

  const navigation = useNavigation();

  const handleFilter = filtro => {
    if (filter === filtro) {
      setFilter(null);
    } else {
      setFilter(filtro);
    }
  };

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

  useEffect(() => {
    let resultado = gastosPorFecha;

    if (filter) {
      console.log('Filtrando: ' + filter);
      const filteredByCategory = {};

      Object.entries(gastosPorFecha).forEach(([fecha, gastosDelDia]) => {
        let gastosFiltrados = [];

        if (filter === 'Transferencias') {
          gastosFiltrados = gastosDelDia.filter(
            gasto => gasto.descripcion === 'Transferencia',
          );
        } else if (filter === 'Pagos y Compras') {
          gastosFiltrados = gastosDelDia.filter(
            gasto =>
              gasto.descripcion !== 'Transferencia' &&
              gasto.categoria !== 'Ingresos',
          );
        } else if (filter === 'Ingresos') {
          gastosFiltrados = gastosDelDia.filter(
            gasto => gasto.result === 'profit',
          );
        }

        if (gastosFiltrados.length > 0) {
          filteredByCategory[fecha] = gastosFiltrados;
        }
      });

      resultado = filteredByCategory;
    }

    if (search.trim()) {
      const filteredBySearch = {};

      Object.entries(resultado).forEach(([fecha, gastosDelDia]) => {
        const gastosFiltrados = gastosDelDia.filter(gasto => {
          const searchLower = search.toLowerCase();
          return (
            gasto.descripcion?.toLowerCase().includes(searchLower) ||
            gasto.origen?.toLowerCase().includes(searchLower) ||
            gasto.categoria?.toLowerCase().includes(searchLower) ||
            String(gasto.monto).includes(search)
          );
        });

        if (gastosFiltrados.length > 0) {
          filteredBySearch[fecha] = gastosFiltrados;
        }
      });

      resultado = filteredBySearch;
    }

    setGastos(resultado);
  }, [search, filter, gastosPorFecha]);

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
        <View style={styles.top}>
          <View
            style={[
              styles.search,
              {
                color: colors.text,
                borderColor: isInputFocused ? colors.primary : colors.border,
                backgroundColor: colors.card,
              },
            ]}
          >
            <Icon
              name="search"
              size={20}
              color={isInputFocused ? colors.primary : colors.label}
            />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Busca alguna palabra clave"
              placeholderTextColor={colors.label}
              value={search}
              onChangeText={setSearch}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
            />
            {search && (
              <Icon
                name="clear"
                size={16}
                color={colors.primary}
                onPress={() => setSearch('')}
              />
            )}
          </View>
          <View style={styles.chips}>
            {filtros.map((filtro, index) => {
              const isSelected = filter === filtro;
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.7}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isSelected
                        ? colors.secondary
                        : colors.card,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => handleFilter(filtro)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: isSelected ? colors.primary : colors.label },
                    ]}
                  >
                    {filtro}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {Object.entries(gastos)
          .reverse()
          .map(([fecha], index) => (
            <CardHistorial
              key={fecha}
              type={'complex'}
              lista={gastos[fecha]}
              index={fecha}
            />
          ))}
        {Object.keys(gastos).length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Image
              source={noResult}
              style={{ width: 200, height: 200 }}
              resizeMode="contain"
              opacity={0.5}
            />
            <Text style={{ color: colors.label, fontSize: 16 }}>
              No se encontraron movimientos
            </Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingBottom: 70,
  },
  input: {
    flex: 1,
    fontSize: 16,
    textAlign: 'left',
    paddingVertical: 10,
  },
  search: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderBottomWidth: 3,
    borderRadius: 8,
    paddingHorizontal: 15,
    gap: 10,
    alignItems: 'center',
  },
  chips: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 10,
    gap: 10,
    alignItems: 'center',
  },
  chip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default PageHistory;
