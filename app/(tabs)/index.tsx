import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Modal, FlatList, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAppStore, CURRENCIES } from '@/store/useAppStore';
import { PieChart } from '@/components/ui/PieChart';

// --- Balance Card ---

function BalanceCardInline() {
  const { balance, weeklyBudget, transactions, currency } = useAppStore();
  const sym = currency.symbol;
  const spentThisWeek = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);
  const progress = Math.min(spentThisWeek / weeklyBudget, 1);

  return (
    <View style={s.balanceCard}>
      <Text style={s.balanceLabel}>Total Balance</Text>
      <Text style={s.balanceAmount}>
        {sym}{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </Text>

      <View style={s.budgetContainer}>
        <View style={s.budgetRow}>
          <Text style={s.budgetTitle}>Weekly Budget</Text>
          <Text style={s.budgetValue}>{sym}{spentThisWeek.toFixed(0)} / {sym}{weeklyBudget}</Text>
        </View>
        <View style={s.progressBg}>
          <View style={[s.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>
    </View>
  );
}

// --- Transaction Row ---

function TransactionRow({ tx }: { tx: any }) {
  const { currency } = useAppStore();
  const sym = currency.symbol;
  const isIncome = tx.type === 'income';
  return (
    <View style={s.txRow}>
      <View style={s.txIcon}>
        <Text style={s.txIconText}>{tx.category.charAt(0)}</Text>
      </View>
      <View style={s.txInfo}>
        <Text style={s.txTitle}>{tx.title}</Text>
        <Text style={s.txMeta}>{tx.category} • {tx.date}</Text>
      </View>
      <Text style={[s.txAmount, isIncome ? s.txIncome : s.txExpense]}>
        {isIncome ? '+' : '-'}{sym}{tx.amount.toFixed(2)}
      </Text>
    </View>
  );
}

// --- Currency Picker Modal ---

function CurrencyPickerModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { currency, setCurrency } = useAppStore();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Pressable style={s.modalOverlay} onPress={onClose}>
        <Pressable style={s.modalSheet} onPress={(e) => e.stopPropagation()}>
          <View style={s.modalHandle} />
          <Text style={s.modalTitle}>Select Currency</Text>
          <FlatList
            data={CURRENCIES}
            keyExtractor={(item) => item.code}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isSelected = item.code === currency.code;
              return (
                <TouchableOpacity
                  style={[s.currencyRow, isSelected && s.currencyRowActive]}
                  onPress={() => { setCurrency(item); onClose(); }}
                  activeOpacity={0.7}
                >
                  <View style={s.currencySymbolBox}>
                    <Text style={[s.currencySymbol, isSelected && { color: '#fff' }]}>{item.symbol}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text style={[s.currencyName, isSelected && { color: '#fff' }]}>{item.name}</Text>
                    <Text style={[s.currencyCode, isSelected && { color: 'rgba(255,255,255,0.7)' }]}>{item.code}</Text>
                  </View>
                  {isSelected && <Text style={s.checkMark}>✓</Text>}
                </TouchableOpacity>
              );
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// --- Main Screen ---

export default function DashboardScreen() {
  const router = useRouter();
  const { transactions, currency } = useAppStore();
  const sym = currency.symbol;
  const recentTransactions = transactions.slice(0, 5);
  const [currencyPickerVisible, setCurrencyPickerVisible] = useState(false);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  // Category breakdown
  const categoryTotals: Record<string, number> = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });
  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const topCategory = sortedCategories[0];
  const topPercentage = totalExpenses > 0 && topCategory ? Math.round((topCategory[1] / totalExpenses) * 100) : 0;
  const barColors = ['#003527', '#1a6b52', '#2e9670', '#4caf50', '#81c784', '#a5d6a7'];

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <ScrollView style={s.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>Welcome back,</Text>
            <Text style={s.userName}>Supanusan</Text>
          </View>
          <View style={s.headerRight}>
            {/* Currency Picker Button */}
            <TouchableOpacity
              onPress={() => setCurrencyPickerVisible(true)}
              style={s.currencyButton}
              activeOpacity={0.7}
            >
              <Text style={s.currencyButtonText}>{currency.symbol}</Text>
              <Text style={s.currencyButtonCode}>{currency.code}</Text>
            </TouchableOpacity>
            {/* Add Button */}
            <TouchableOpacity
              onPress={() => router.push('/add')}
              style={s.addButton}
              activeOpacity={0.7}
            >
              <Plus color="white" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance Card */}
        <BalanceCardInline />

        {/* Quick Stats */}
        <View style={s.statsRow}>
          <View style={[s.statCard, { marginRight: 8 }]}>
            <Text style={s.statLabel}>Income</Text>
            <Text style={[s.statValue, { color: '#4caf50' }]}>{sym}{totalIncome.toFixed(2)}</Text>
          </View>
          <View style={[s.statCard, { marginLeft: 8 }]}>
            <Text style={s.statLabel}>Expenses</Text>
            <Text style={[s.statValue, { color: '#e53935' }]}>{sym}{totalExpenses.toFixed(2)}</Text>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View>
              <Text style={s.sectionTitle}>Recent Transactions</Text>
              <Text style={s.sectionSubtitle}>Latest activity</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
              <Text style={s.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={s.card}>
            {recentTransactions.length === 0 ? (
              <View style={s.emptyState}>
                <Text style={s.emptyIcon}>📝</Text>
                <Text style={s.emptyText}>No transactions yet</Text>
                <Text style={s.emptySubtext}>Tap + to add your first one</Text>
              </View>
            ) : (
              recentTransactions.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} />
              ))
            )}
          </View>
        </View>

        {/* Spending Analysis with Pie Chart */}
        {sortedCategories.length > 0 && (
          <View style={[s.section, { marginBottom: 32 }]}>
            <Text style={s.sectionTitle}>Spending Analysis</Text>
            <View style={s.card}>
              {/* Pie Chart Row */}
              <View style={s.pieRow}>
                <View style={s.pieContainer}>
                  <PieChart
                    data={sortedCategories.slice(0, 6).map(([cat, amt], i) => ({
                      value: amt,
                      color: barColors[i] || '#a5d6a7',
                      label: cat,
                    }))}
                    size={140}
                    innerRadius={0.6}
                  />
                  <View style={s.pieCenter}>
                    <Text style={s.pieCenterValue}>{sym}{totalExpenses.toFixed(0)}</Text>
                    <Text style={s.pieCenterLabel}>spent</Text>
                  </View>
                </View>

                {/* Legend next to chart */}
                <View style={s.pieLegend}>
                  {sortedCategories.slice(0, 4).map(([cat, amt], i) => {
                    const pct = totalExpenses > 0 ? Math.round((amt / totalExpenses) * 100) : 0;
                    return (
                      <View key={cat} style={s.pieLegendItem}>
                        <View style={[s.legendDot, { backgroundColor: barColors[i] || '#ccc' }]} />
                        <View style={{ flex: 1 }}>
                          <Text style={s.pieLegendName}>{cat}</Text>
                          <Text style={s.pieLegendPct}>{pct}%</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Currency Picker Modal */}
      <CurrencyPickerModal
        visible={currencyPickerVisible}
        onClose={() => setCurrencyPickerVisible(false)}
      />
    </SafeAreaView>
  );
}

// --- Styles ---

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f3' },
  scrollView: { flex: 1, paddingHorizontal: 20 },

  // Header
  header: { paddingVertical: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  greeting: { fontFamily: 'Manrope_400Regular', fontSize: 14, color: '#545f73' },
  userName: { fontFamily: 'Manrope_700Bold', fontSize: 24, color: '#191c1b' },
  addButton: {
    width: 48, height: 48, backgroundColor: '#003527',
    borderRadius: 24, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#003527', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },

  // Currency Button
  currencyButton: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#ffffff', borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1.5, borderColor: '#eceeeb',
  },
  currencyButtonText: {
    fontFamily: 'PublicSans_700Bold', fontSize: 18, color: '#003527', marginRight: 6,
  },
  currencyButtonCode: {
    fontFamily: 'Manrope_500Medium', fontSize: 12, color: '#545f73',
  },

  // Balance Card
  balanceCard: {
    backgroundColor: '#003527', borderRadius: 20, padding: 24,
    shadowColor: '#003527', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25, shadowRadius: 12, elevation: 8,
  },
  balanceLabel: { fontFamily: 'Manrope_400Regular', fontSize: 14, color: 'rgba(244,246,243,0.7)', marginBottom: 4 },
  balanceAmount: { fontFamily: 'PublicSans_700Bold', fontSize: 36, color: '#ffffff', marginBottom: 20 },
  budgetContainer: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: 16 },
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  budgetTitle: { fontFamily: 'Manrope_600SemiBold', fontSize: 14, color: '#ffffff' },
  budgetValue: { fontFamily: 'PublicSans_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  progressBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#4caf50', borderRadius: 3 },

  // Quick Stats
  statsRow: { flexDirection: 'row', marginTop: 16, marginBottom: 8 },
  statCard: {
    flex: 1, backgroundColor: '#ffffff', borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: '#eceeeb',
  },
  statLabel: { fontFamily: 'Manrope_400Regular', fontSize: 12, color: '#545f73', marginBottom: 6 },
  statValue: { fontFamily: 'PublicSans_700Bold', fontSize: 20 },

  // Sections
  section: { marginTop: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
  sectionTitle: { fontFamily: 'Manrope_700Bold', fontSize: 18, color: '#191c1b' },
  sectionSubtitle: { fontFamily: 'Manrope_400Regular', fontSize: 12, color: '#545f73', marginTop: 2 },
  viewAll: { fontFamily: 'Manrope_600SemiBold', fontSize: 14, color: '#003527' },

  // Card
  card: {
    backgroundColor: '#ffffff', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#eceeeb',
  },

  // Transaction Row
  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f0f2ef' },
  txIcon: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#f4f6f3',
    alignItems: 'center', justifyContent: 'center',
  },
  txIconText: { fontFamily: 'Manrope_700Bold', fontSize: 16, color: '#545f73' },
  txInfo: { flex: 1, marginLeft: 14 },
  txTitle: { fontFamily: 'Manrope_600SemiBold', fontSize: 15, color: '#191c1b' },
  txMeta: { fontFamily: 'Manrope_400Regular', fontSize: 12, color: '#545f73', marginTop: 2 },
  txAmount: { fontFamily: 'PublicSans_600SemiBold', fontSize: 15 },
  txIncome: { color: '#4caf50' },
  txExpense: { color: '#e53935' },

  // Empty State
  emptyState: { alignItems: 'center', paddingVertical: 32 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontFamily: 'Manrope_600SemiBold', fontSize: 16, color: '#191c1b' },
  emptySubtext: { fontFamily: 'Manrope_400Regular', fontSize: 13, color: '#545f73', marginTop: 4 },

  // Pie Chart - Spending Analysis
  pieRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 8,
  },
  pieContainer: {
    position: 'relative', alignItems: 'center', justifyContent: 'center',
  },
  pieCenter: {
    position: 'absolute', alignItems: 'center', justifyContent: 'center',
  },
  pieCenterValue: { fontFamily: 'PublicSans_700Bold', fontSize: 16, color: '#003527' },
  pieCenterLabel: { fontFamily: 'Manrope_400Regular', fontSize: 11, color: '#545f73' },
  pieLegend: {
    flex: 1, marginLeft: 20, justifyContent: 'center',
  },
  pieLegendItem: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 10,
  },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  pieLegendName: { fontFamily: 'Manrope_500Medium', fontSize: 13, color: '#191c1b' },
  pieLegendPct: { fontFamily: 'PublicSans_600SemiBold', fontSize: 12, color: '#545f73', marginTop: 1 },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingBottom: 40, maxHeight: '70%',
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: '#d1d5db',
    alignSelf: 'center', marginTop: 12, marginBottom: 16,
  },
  modalTitle: {
    fontFamily: 'Manrope_700Bold', fontSize: 20, color: '#191c1b',
    marginBottom: 16,
  },
  currencyRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 12, borderRadius: 14,
    marginBottom: 6,
  },
  currencyRowActive: {
    backgroundColor: '#003527',
  },
  currencySymbolBox: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#f4f6f3',
    alignItems: 'center', justifyContent: 'center',
  },
  currencySymbol: { fontFamily: 'PublicSans_700Bold', fontSize: 18, color: '#003527' },
  currencyName: { fontFamily: 'Manrope_600SemiBold', fontSize: 15, color: '#191c1b' },
  currencyCode: { fontFamily: 'Manrope_400Regular', fontSize: 12, color: '#545f73', marginTop: 1 },
  checkMark: { fontFamily: 'PublicSans_700Bold', fontSize: 18, color: '#ffffff', marginLeft: 8 },
});
