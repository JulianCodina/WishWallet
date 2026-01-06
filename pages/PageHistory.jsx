import { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import CardHistorial from '../components/CardHistorial';
import LinearGradient from 'react-native-linear-gradient';
import { useAppContext } from '../contexts/AppContext';
import { useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/MaterialIcons';

const filtros = ['Transferencias', 'Pagos y Compras', 'Ingresos'];

function PageHistory() {
  const { colors, setActiveTab } = useAppContext();
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState([]);

  const navigation = useNavigation();

  const handleSearch = () => {
    console.log('Buscando:', search);
  };

  const handleFilter = filtro => {
    if (filters.includes(filtro)) {
      setFilters(filters.filter(item => item !== filtro));
    } else {
      setFilters([...filters, filtro]);
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
              style={[styles.input]}
              placeholder="Ingresa un alias o CVU"
              placeholderTextColor={colors.label}
              value={search}
              onChangeText={setSearch}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              returnKeyType="next"
            />
            <Icon
              name="x"
              size={15}
              color={isInputFocused ? colors.primary : colors.label}
            />
          </View>
          <View style={styles.chips}>
            {filtros.map((filtro, index) => {
              const isSelected = filters.includes(filtro);
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
  input: {
    width: '100%',
    fontSize: 16,
    textAlign: 'left',
  },
  search: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderBottomWidth: 3,
    borderRadius: 8,
    paddingVertical: 2,
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
