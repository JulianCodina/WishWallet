import { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppContext } from '../contexts/AppContext';
import GraphCard from '../components/CardGraphics';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useNavigation } from '@react-navigation/native';

function PageStatistics() {
  const { colors, setActiveTab, gastos } = useAppContext();
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

  const stats = useMemo(() => {
    if (!gastos || !Array.isArray(gastos))
      return {
        totalReceived: 0,
        totalSpent: 0,
        incomeCategories: [],
        expenseCategories: [],
      };

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyGastos = gastos.filter(gasto => {
      const d = new Date(gasto.fecha);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const totalReceived = monthlyGastos
      .filter(g => g.result === 'profit')
      .reduce((sum, g) => sum + Number(g.monto || 0), 0);

    const totalSpent = monthlyGastos
      .filter(g => g.result === 'success')
      .reduce((sum, g) => sum + Number(g.monto || 0), 0);

    const expensesByDesc = monthlyGastos
      .filter(g => g.result === 'success')
      .reduce((acc, g) => {
        const amount = Number(g.monto || 0);
        acc[g.descripcion] = (acc[g.descripcion] || 0) + amount;
        return acc;
      }, {});

    const expenseCategories = Object.entries(expensesByDesc)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    const incomeByDesc = monthlyGastos
      .filter(g => g.result === 'profit')
      .reduce((acc, g) => {
        const amount = Number(g.monto || 0);
        acc[g.descripcion] = (acc[g.descripcion] || 0) + amount;
        return acc;
      }, {});

    const incomeCategories = Object.entries(incomeByDesc)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalReceived > 0 ? (amount / totalReceived) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return { totalReceived, totalSpent, incomeCategories, expenseCategories };
  }, [gastos]);

  const getIconForCategory = name => {
    const n = name.toLowerCase();
    if (n.includes('comida') || n.includes('cafe') || n.includes('restaurante'))
      return 'silverware-fork-knife';
    if (
      n.includes('transporte') ||
      n.includes('sube') ||
      n.includes('uber') ||
      n.includes('combustible')
    )
      return 'car';
    if (
      n.includes('suscripciones') ||
      n.includes('netflix') ||
      n.includes('spotify')
    )
      return 'television-play';
    if (n.includes('compras') || n.includes('supermercado'))
      return 'shopping-outline';
    if (n.includes('salud') || n.includes('farmacia'))
      return 'hospital-box-outline';
    if (
      n.includes('servicios') ||
      n.includes('luz') ||
      n.includes('agua') ||
      n.includes('internet')
    )
      return 'flash-outline';
    if (
      n.includes('ingresos') ||
      n.includes('salario') ||
      n.includes('transferencia')
    )
      return 'cash-plus';
    return 'cash-multiple';
  };

  const renderCategorySection = (title, categories, color) => (
    <View style={{ marginBottom: 20 }}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {title}
        </Text>
        <TouchableOpacity
          onPress={() => {
            setActiveTab('history');
            navigation.reset({ index: 0, routes: [{ name: 'History' }] });
          }}
        >
          <Text style={[styles.manageLink, { color: colors.primary }]}>
            Ver todo
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.categoriesCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {categories.length > 0 ? (
          categories.map((cat, index) => (
            <View key={index} style={styles.categoryItem}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.secondary + '40' },
                ]}
              >
                <Icon
                  name={getIconForCategory(cat.name)}
                  size={22}
                  color={colors.primary}
                />
              </View>
              <View style={styles.categoryContent}>
                <View style={styles.categoryHeader}>
                  <Text style={[styles.categoryName, { color: colors.text }]}>
                    {cat.name}
                  </Text>
                  <Text style={[styles.categoryAmount, { color: color }]}>
                    $
                    {cat.amount.toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                </View>
                <View
                  style={[
                    styles.progressContainer,
                    { backgroundColor: colors.secondary },
                  ]}
                >
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${cat.percentage}%`,
                        backgroundColor: colors.primary,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.noItemsContainer}>
            <Text style={[styles.noItems, { color: colors.label }]}>
              No hay {title.toLowerCase()} registrados este mes
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={[colors.secondary, colors.background, colors.background]}
      locations={[0, 0.3, 1]}
      style={styles.page}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <GraphCard type={'complete'} />

        <View style={styles.summaryContainer}>
          <View
            style={[
              styles.summaryCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.summaryLabel, { color: colors.label }]}>
              Total Gastado
            </Text>
            <Text style={[styles.summaryValue, { color: '#FF5252' }]}>
              $
              {stats.totalSpent.toLocaleString('es-AR', {
                minimumFractionDigits: 2,
              })}
            </Text>
          </View>
          <View
            style={[
              styles.summaryCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.summaryLabel, { color: colors.label }]}>
              Total Recibido
            </Text>
            <Text style={[styles.summaryValue, { color: colors.primary }]}>
              $
              {stats.totalReceived.toLocaleString('es-AR', {
                minimumFractionDigits: 2,
              })}
            </Text>
          </View>
        </View>

        {renderCategorySection(
          'Categoria de ingresos',
          stats.incomeCategories,
          colors.primary,
        )}
        {renderCategorySection(
          'Categoria de gastos',
          stats.expenseCategories,
          '#FF5252',
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
    gap: 15,
  },
  summaryCard: {
    flex: 1,
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderBottomWidth: 3,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  manageLink: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoriesCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderBottomWidth: 3,
    gap: 5,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 15,
  },
  iconContainer: {
    width: 35,
    height: 35,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContent: {
    flex: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '600',
  },
  categoryAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
  progressContainer: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  noItemsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noItems: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default PageStatistics;
