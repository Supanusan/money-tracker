import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore, CATEGORIES } from '@/store/useAppStore';
import { PieChart } from '@/components/ui/PieChart';

const EXPENSE_COLORS = ['#003527', '#1a6b52', '#2e9670', '#4caf50', '#81c784', '#a5d6a7'];
const INCOME_COLORS = ['#1565c0', '#1e88e5', '#42a5f5', '#64b5f6'];

export default function InsightsScreen() {
  const { transactions, balance, currency } = useAppStore();
  const sym = currency.symbol;

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const txCount = transactions.length;

  // Category breakdown for expenses
  const categoryBreakdown = CATEGORIES.expense.map((cat, i) => {
    const catTotal = transactions
      .filter(t => t.category === cat.name && t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    const percentage = totalExpenses > 0 ? (catTotal / totalExpenses) * 100 : 0;
    return { name: cat.name, total: catTotal, percentage, color: EXPENSE_COLORS[i] || '#ccc' };
  }).filter(c => c.total > 0);

  // Income breakdown
  const incomeBreakdown = CATEGORIES.income.map((cat, i) => {
    const catTotal = transactions
      .filter(t => t.category === cat.name && t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const percentage = totalIncome > 0 ? (catTotal / totalIncome) * 100 : 0;
    return { name: cat.name, total: catTotal, percentage, color: INCOME_COLORS[i] || '#ccc' };
  }).filter(c => c.total > 0);

  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

  // Pie chart data
  const expensePieData = categoryBreakdown.map(c => ({
    value: c.total,
    color: c.color,
    label: c.name,
  }));

  const incomePieData = incomeBreakdown.map(c => ({
    value: c.total,
    color: c.color,
    label: c.name,
  }));

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerTitle}>Spending Insights</Text>
          <Text style={s.headerSub}>Understand your money</Text>
        </View>

        {/* Summary Cards */}
        <View style={s.summaryRow}>
          <View style={[s.summaryCard, { backgroundColor: '#003527' }]}>
            <Text style={s.summaryLabelLight}>Total Spent</Text>
            <Text style={s.summaryValueLight}>{sym}{totalExpenses.toFixed(2)}</Text>
          </View>
          <View style={{ width: 12 }} />
          <View style={[s.summaryCard, { backgroundColor: '#1a6b52' }]}>
            <Text style={s.summaryLabelLight}>Total Earned</Text>
            <Text style={s.summaryValueLight}>{sym}{totalIncome.toFixed(2)}</Text>
          </View>
        </View>

        {/* Key Metrics */}
        <View style={s.metricsRow}>
          <View style={s.metricCard}>
            <Text style={s.metricValue}>{txCount}</Text>
            <Text style={s.metricLabel}>Transactions</Text>
          </View>
          <View style={s.metricCard}>
            <Text style={[s.metricValue, { color: savingsRate >= 0 ? '#4caf50' : '#e53935' }]}>
              {savingsRate}%
            </Text>
            <Text style={s.metricLabel}>Savings Rate</Text>
          </View>
          <View style={s.metricCard}>
            <Text style={s.metricValue}>{sym}{balance.toFixed(0)}</Text>
            <Text style={s.metricLabel}>Balance</Text>
          </View>
        </View>

        {/* Expense Pie Chart + Breakdown */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Expense Breakdown</Text>
          <View style={s.card}>
            {categoryBreakdown.length === 0 ? (
              <View style={s.emptyState}>
                <Text style={s.emptyText}>No expenses recorded yet</Text>
              </View>
            ) : (
              <>
                {/* Pie Chart */}
                <View style={s.chartContainer}>
                  <PieChart data={expensePieData} size={200} innerRadius={0.58} />
                  <View style={s.chartCenter}>
                    <Text style={s.chartCenterLabel}>Total</Text>
                    <Text style={s.chartCenterValue}>{sym}{totalExpenses.toFixed(0)}</Text>
                  </View>
                </View>

                {/* Legend */}
                <View style={s.legendContainer}>
                  {categoryBreakdown.map((cat) => (
                    <View key={cat.name} style={s.legendRow}>
                      <View style={[s.legendDot, { backgroundColor: cat.color }]} />
                      <Text style={s.legendName}>{cat.name}</Text>
                      <Text style={s.legendAmount}>{sym}{cat.total.toFixed(2)}</Text>
                      <View style={s.legendPctBadge}>
                        <Text style={s.legendPctText}>{Math.round(cat.percentage)}%</Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Bar breakdown */}
                {categoryBreakdown.map((cat) => (
                  <View key={cat.name} style={s.catRow}>
                    <View style={s.catHeader}>
                      <Text style={s.catName}>{cat.name}</Text>
                      <Text style={s.catAmount}>{sym}{cat.total.toFixed(2)}</Text>
                    </View>
                    <View style={s.barBg}>
                      <View style={[s.barFill, { width: `${cat.percentage}%`, backgroundColor: cat.color }]} />
                    </View>
                  </View>
                ))}
              </>
            )}
          </View>
        </View>

        {/* Income Pie Chart + Breakdown */}
        {incomeBreakdown.length > 0 && (
          <View style={[s.section, { marginBottom: 32 }]}>
            <Text style={s.sectionTitle}>Income Sources</Text>
            <View style={s.card}>
              {/* Pie Chart */}
              <View style={s.chartContainer}>
                <PieChart data={incomePieData} size={180} innerRadius={0.58} />
                <View style={s.chartCenter}>
                  <Text style={s.chartCenterLabel}>Total</Text>
                  <Text style={[s.chartCenterValue, { color: '#1565c0' }]}>{sym}{totalIncome.toFixed(0)}</Text>
                </View>
              </View>

              {/* Legend */}
              <View style={s.legendContainer}>
                {incomeBreakdown.map((cat) => (
                  <View key={cat.name} style={s.legendRow}>
                    <View style={[s.legendDot, { backgroundColor: cat.color }]} />
                    <Text style={s.legendName}>{cat.name}</Text>
                    <Text style={[s.legendAmount, { color: '#1565c0' }]}>{sym}{cat.total.toFixed(2)}</Text>
                    <View style={[s.legendPctBadge, { backgroundColor: 'rgba(21,101,192,0.08)' }]}>
                      <Text style={[s.legendPctText, { color: '#1565c0' }]}>{Math.round(cat.percentage)}%</Text>
                    </View>
                  </View>
                ))}
              </View>

              {incomeBreakdown.map((cat) => (
                <View key={cat.name} style={s.catRow}>
                  <View style={s.catHeader}>
                    <Text style={s.catName}>{cat.name}</Text>
                    <Text style={[s.catAmount, { color: '#1565c0' }]}>
                      {sym}{cat.total.toFixed(2)}
                    </Text>
                  </View>
                  <View style={s.barBg}>
                    <View style={[s.barFill, { width: `${cat.percentage}%`, backgroundColor: cat.color }]} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f3' },
  scroll: { flex: 1, paddingHorizontal: 20 },

  header: { paddingVertical: 20 },
  headerTitle: { fontFamily: 'Manrope_700Bold', fontSize: 24, color: '#191c1b' },
  headerSub: { fontFamily: 'Manrope_400Regular', fontSize: 14, color: '#545f73', marginTop: 2 },

  // Summary
  summaryRow: { flexDirection: 'row', marginBottom: 16 },
  summaryCard: {
    flex: 1, borderRadius: 16, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 6, elevation: 4,
  },
  summaryLabelLight: { fontFamily: 'Manrope_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 6 },
  summaryValueLight: { fontFamily: 'PublicSans_700Bold', fontSize: 22, color: '#ffffff' },

  // Metrics
  metricsRow: { flexDirection: 'row', marginBottom: 20 },
  metricCard: {
    flex: 1, backgroundColor: '#ffffff', borderRadius: 14, padding: 16,
    alignItems: 'center', borderWidth: 1, borderColor: '#eceeeb', marginHorizontal: 4,
  },
  metricValue: { fontFamily: 'PublicSans_700Bold', fontSize: 20, color: '#191c1b', marginBottom: 4 },
  metricLabel: { fontFamily: 'Manrope_400Regular', fontSize: 11, color: '#545f73' },

  // Section
  section: { marginTop: 8, marginBottom: 16 },
  sectionTitle: { fontFamily: 'Manrope_700Bold', fontSize: 18, color: '#191c1b', marginBottom: 12 },

  card: {
    backgroundColor: '#ffffff', borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: '#eceeeb',
  },

  // Pie Chart
  chartContainer: {
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24, position: 'relative',
  },
  chartCenter: {
    position: 'absolute', alignItems: 'center', justifyContent: 'center',
  },
  chartCenterLabel: {
    fontFamily: 'Manrope_400Regular', fontSize: 12, color: '#545f73',
  },
  chartCenterValue: {
    fontFamily: 'PublicSans_700Bold', fontSize: 20, color: '#003527', marginTop: 2,
  },

  // Legend
  legendContainer: { marginBottom: 20 },
  legendRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: '#f5f5f5',
  },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  legendName: { flex: 1, fontFamily: 'Manrope_500Medium', fontSize: 14, color: '#191c1b' },
  legendAmount: { fontFamily: 'PublicSans_600SemiBold', fontSize: 14, color: '#003527', marginRight: 10 },
  legendPctBadge: {
    backgroundColor: 'rgba(0,53,39,0.08)', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  legendPctText: { fontFamily: 'PublicSans_600SemiBold', fontSize: 11, color: '#003527' },

  // Bar breakdown
  catRow: { marginBottom: 14 },
  catHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  catName: { fontFamily: 'Manrope_600SemiBold', fontSize: 13, color: '#191c1b' },
  catAmount: { fontFamily: 'PublicSans_400Regular', fontSize: 12, color: '#545f73' },
  barBg: { height: 6, backgroundColor: '#eceeeb', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },

  emptyState: { alignItems: 'center', paddingVertical: 24 },
  emptyText: { fontFamily: 'Manrope_400Regular', fontSize: 14, color: '#545f73' },
});
