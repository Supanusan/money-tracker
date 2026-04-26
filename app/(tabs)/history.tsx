import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';

export default function HistoryScreen() {
  const { transactions, deleteTransaction, currency } = useAppStore();
  const sym = currency.symbol;

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.inner}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerTitle}>History</Text>
          <Text style={s.headerSub}>All your transactions</Text>
        </View>

        {/* Transaction List */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {transactions.length === 0 ? (
            <View style={s.emptyState}>
              <Text style={s.emptyIcon}>📋</Text>
              <Text style={s.emptyText}>No transactions yet</Text>
              <Text style={s.emptySubtext}>Your history will appear here</Text>
            </View>
          ) : (
            <View style={s.card}>
              <Text style={s.monthLabel}>THIS MONTH</Text>
              {transactions.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <TouchableOpacity
                    key={tx.id}
                    style={s.txRow}
                    onLongPress={() => deleteTransaction(tx.id)}
                    activeOpacity={0.7}
                  >
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
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f3' },
  inner: { flex: 1, paddingHorizontal: 20 },

  header: { paddingVertical: 20 },
  headerTitle: { fontFamily: 'Manrope_700Bold', fontSize: 24, color: '#191c1b' },
  headerSub: { fontFamily: 'Manrope_400Regular', fontSize: 14, color: '#545f73', marginTop: 2 },

  monthLabel: {
    fontFamily: 'Manrope_600SemiBold', fontSize: 11, color: '#545f73',
    letterSpacing: 1.5, marginBottom: 12,
  },

  card: {
    backgroundColor: '#ffffff', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#eceeeb', marginBottom: 20,
  },

  txRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f0f2ef',
  },
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

  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontFamily: 'Manrope_600SemiBold', fontSize: 18, color: '#191c1b' },
  emptySubtext: { fontFamily: 'Manrope_400Regular', fontSize: 14, color: '#545f73', marginTop: 4 },
});
