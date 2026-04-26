import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppStore, CATEGORIES, TransactionType } from '@/store/useAppStore';

export default function AddTransactionScreen() {
  const router = useRouter();
  const { addTransaction, currency } = useAppStore();
  const sym = currency.symbol;
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES.expense[0].name);

  const handleSave = () => {
    if (!amount || !title) {
      Alert.alert('Missing Info', 'Please enter both a title and an amount.');
      return;
    }

    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid positive number.');
      return;
    }

    addTransaction({
      title: title.trim(),
      amount: parsed,
      category,
      type,
    });

    router.back();
  };

  const currentCategories = CATEGORIES[type];

  return (
    <SafeAreaView style={s.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={s.scroll} keyboardShouldPersistTaps="handled">
          {/* Type Toggle */}
          <View style={s.toggleRow}>
            <TouchableOpacity
              onPress={() => { setType('expense'); setCategory(CATEGORIES.expense[0].name); }}
              style={[s.toggleBtn, type === 'expense' && s.toggleActive]}
              activeOpacity={0.7}
            >
              <Text style={[s.toggleText, type === 'expense' && s.toggleTextExpense]}>Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { setType('income'); setCategory(CATEGORIES.income[0].name); }}
              style={[s.toggleBtn, type === 'income' && s.toggleActive]}
              activeOpacity={0.7}
            >
              <Text style={[s.toggleText, type === 'income' && s.toggleTextIncome]}>Income</Text>
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          <View style={s.amountSection}>
            <Text style={s.amountLabel}>Amount ({currency.code})</Text>
            <View style={s.amountRow}>
              <Text style={s.dollarSign}>{sym}</Text>
              <TextInput
                style={s.amountInput}
                placeholder="0.00"
                placeholderTextColor="#a0a0a0"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                autoFocus
              />
            </View>
          </View>

          {/* Title Input */}
          <View style={s.fieldSection}>
            <Text style={s.fieldLabel}>DETAILS</Text>
            <View style={s.fieldCard}>
              <Text style={s.fieldHint}>Title</Text>
              <TextInput
                style={s.fieldInput}
                placeholder="What is this for?"
                placeholderTextColor="#a0a0a0"
                value={title}
                onChangeText={setTitle}
              />
            </View>
          </View>

          {/* Category Selection */}
          <View style={s.fieldSection}>
            <Text style={s.fieldLabel}>CATEGORY</Text>
            <View style={s.categoryGrid}>
              {currentCategories.map((cat) => (
                <TouchableOpacity
                  key={cat.name}
                  onPress={() => setCategory(cat.name)}
                  style={[
                    s.categoryChip,
                    category === cat.name && s.categoryChipActive,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      s.categoryText,
                      category === cat.name && s.categoryTextActive,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            style={s.saveButton}
            activeOpacity={0.8}
          >
            <Text style={s.saveButtonText}>
              Save {type === 'income' ? 'Income' : 'Expense'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scroll: { flex: 1, paddingHorizontal: 24 },

  // Type Toggle
  toggleRow: {
    flexDirection: 'row', backgroundColor: '#f4f6f3',
    borderRadius: 16, padding: 4, marginTop: 20, marginBottom: 32,
  },
  toggleBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
  },
  toggleText: { fontFamily: 'Manrope_700Bold', fontSize: 15, color: '#545f73' },
  toggleTextExpense: { color: '#e53935' },
  toggleTextIncome: { color: '#4caf50' },

  // Amount
  amountSection: { alignItems: 'center', marginBottom: 32 },
  amountLabel: { fontFamily: 'Manrope_400Regular', fontSize: 14, color: '#545f73', marginBottom: 8 },
  amountRow: { flexDirection: 'row', alignItems: 'center' },
  dollarSign: { fontFamily: 'PublicSans_700Bold', fontSize: 36, color: '#191c1b', marginRight: 4 },
  amountInput: {
    fontFamily: 'PublicSans_700Bold', fontSize: 48, color: '#191c1b',
    minWidth: 120, textAlign: 'center', padding: 0,
  },

  // Fields
  fieldSection: { marginBottom: 24 },
  fieldLabel: {
    fontFamily: 'Manrope_600SemiBold', fontSize: 11, color: '#545f73',
    letterSpacing: 1.5, marginBottom: 12,
  },
  fieldCard: {
    backgroundColor: '#f4f6f3', borderRadius: 16, padding: 16,
  },
  fieldHint: { fontFamily: 'Manrope_400Regular', fontSize: 12, color: '#545f73', marginBottom: 4 },
  fieldInput: { fontFamily: 'Manrope_600SemiBold', fontSize: 17, color: '#191c1b', padding: 0 },

  // Categories
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  categoryChip: {
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 100,
    borderWidth: 1.5, borderColor: '#eceeeb', backgroundColor: '#ffffff',
    marginRight: 8, marginBottom: 10,
  },
  categoryChipActive: {
    backgroundColor: '#003527', borderColor: '#003527',
  },
  categoryText: { fontFamily: 'Manrope_500Medium', fontSize: 14, color: '#545f73' },
  categoryTextActive: { color: '#ffffff', fontFamily: 'Manrope_700Bold' },

  // Save Button
  saveButton: {
    backgroundColor: '#003527', borderRadius: 16, paddingVertical: 18,
    alignItems: 'center', marginTop: 16, marginBottom: 40,
    shadowColor: '#003527', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  saveButtonText: { fontFamily: 'Manrope_700Bold', fontSize: 17, color: '#ffffff' },
});
