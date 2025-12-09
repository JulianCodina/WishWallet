import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { useAppContext } from '../contexts/AppContext';

const GraphCard = () => {
  const { gastos, colors } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [balanceData, setBalanceData] = useState([]);

  useEffect(() => {
    if (!gastos) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const today = currentDate.getDate();

    let saldoInicialMes = 0;

    const gastosHastaMesAnterior = gastos.filter(gasto => {
      if (!gasto.fecha) return false;
      const fechaGasto = new Date(gasto.fecha);
      return (
        fechaGasto.getFullYear() < currentYear ||
        (fechaGasto.getFullYear() === currentYear &&
          fechaGasto.getMonth() < currentMonth)
      );
    });

    gastosHastaMesAnterior.forEach(gasto => {
      const monto = parseFloat(gasto.monto) || 0;
      if (gasto.result === 'profit') {
        saldoInicialMes += monto;
      } else if (gasto.result === 'success') {
        saldoInicialMes -= monto;
      }
    });

    const balances = [];

    for (let dia = 1; dia <= today; dia++) {
      const gastosDelDia = gastos.filter(gasto => {
        if (!gasto.fecha) return false;
        const fechaGasto = new Date(gasto.fecha);
        return (
          fechaGasto.getDate() === dia &&
          fechaGasto.getMonth() === currentMonth &&
          fechaGasto.getFullYear() === currentYear
        );
      });

      let balanceDia = 0;
      gastosDelDia.forEach(gasto => {
        const monto = parseFloat(gasto.monto) || 0;
        if (gasto.result === 'profit') {
          balanceDia += monto;
        } else if (gasto.result === 'success') {
          balanceDia -= monto;
        }
      });

      balances.push({
        dia,
        balance: balanceDia,
      });
    }

    setBalanceData(balances);
    setLoading(false);
  }, [gastos]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Cargando estadísticas...
        </Text>
      </View>
    );
  }

  const hasData = balanceData.some(d => d.balance !== 0);

  return (
    <>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Balance del mes
        </Text>
        <Text style={[styles.verMas, { color: colors.primary }]}>Ver más</Text>
      </View>
      <View
        style={[
          styles.container,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {hasData ? (
          <>
            <BalanceChart data={balanceData} colors={colors} />
            <View style={styles.infoContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, styles.legendGreen]} />
                <Text style={[styles.legendText, { color: colors.text }]}>
                  Ingresos
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, styles.legendRed]} />
                <Text style={[styles.legendText, { color: colors.text }]}>
                  Gastos
                </Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={[styles.noDataText, { color: colors.label }]}>
              No hay movimientos este mes
            </Text>
          </View>
        )}
      </View>
    </>
  );
};

const BalanceChart = ({ data, colors }) => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 80;
  const chartHeight = 150;
  const padding = { top: 10, bottom: 0, left: 5, right: 5 };
  const totalDays = 31; // Mostrar siempre 31 días

  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  // Crear un array con los 31 días
  const allDaysData = Array.from({ length: totalDays }, (_, i) => {
    const day = i + 1;
    const dayData = data.find(d => d.dia === day);
    return dayData || { dia: day, balance: 0 };
  });

  // Encontrar el valor máximo para escalar
  const maxAbsValue = Math.max(
    ...allDaysData.map(d => Math.abs(d.balance)).filter(v => v > 0),
    100,
  );

  const barSpacing = graphWidth / totalDays;
  const barWidth = Math.max(1.5, barSpacing - 2); // Barras más delgadas para mejor visualización
  const zeroY = padding.top + graphHeight / 2;

  return (
    <View style={styles.chartContainer}>
      <Svg width={chartWidth} height={chartHeight}>
        <Line
          x1={padding.left}
          y1={zeroY}
          x2={chartWidth - padding.right}
          y2={zeroY}
          stroke={colors.border || '#444'}
          strokeWidth="1"
          opacity="0.5"
        />

        {allDaysData.map((item, index) => {
          if (item.balance === 0) return null;

          const x =
            padding.left + index * barSpacing + (barSpacing - barWidth) / 2;
          const normalizedValue =
            (item.balance / maxAbsValue) * (graphHeight / 2);

          let barHeight = Math.abs(normalizedValue);
          let y = item.balance >= 0 ? zeroY - barHeight : zeroY;

          const barColor =
            item.balance >= 0
              ? 'rgba(75, 192, 192, 1)'
              : 'rgba(255, 99, 132, 1)';

          return (
            <Rect
              key={`bar-${index}`}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={barColor}
              rx="1"
            />
          );
        })}

        {allDaysData.map((item, index) => {
          const shouldShowLabel = index === 0 || (index + 1) % 5 === 0;

          if (!shouldShowLabel) return null;

          const x = padding.left + index * barSpacing + barSpacing / 2;
          const y = chartHeight - 5;

          return (
            <SvgText
              key={`label-${index}`}
              x={x}
              y={y}
              fill={colors.label || '#999'}
              fontSize="10"
              textAnchor="middle"
            >
              {item.dia}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    opacity: 0.8,
  },
  verMas: {
    fontSize: 15,
  },
  container: {
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderBottomWidth: 3,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  loadingText: {
    marginTop: 8,
    textAlign: 'center',
  },
  noDataContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 6,
  },
  legendGreen: {
    backgroundColor: 'rgba(75, 192, 192, 1)',
  },
  legendRed: {
    backgroundColor: 'rgba(255, 99, 132, 1)',
  },
  legendText: {
    fontSize: 11,
    fontWeight: '400',
  },
});

export default GraphCard;
