import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LucideIcon, Utensils, Car, ShoppingBag, Play, FileText, MoreHorizontal, Briefcase, Laptop, TrendingUp, Gift } from 'lucide-react-native';
import { Transaction } from '@/store/useAppStore';

const ICON_MAP: Record<string, LucideIcon> = {
  'Food & Drink': Utensils,
  'Transport': Car,
  'Shopping': ShoppingBag,
  'Entertainment': Play,
  'Bills': FileText,
  'Other': MoreHorizontal,
  'Salary': Briefcase,
  'Freelance': Laptop,
  'Investment': TrendingUp,
  'Gift': Gift,
};

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

export function TransactionItem({ transaction, onPress }: TransactionItemProps) {
  const Icon = ICON_MAP[transaction.category] || MoreHorizontal;
  const isIncome = transaction.type === 'income';

  return (
    <TouchableOpacity 
      onPress={onPress}
      className="flex-row items-center py-4 border-b border-fintrack-container"
    >
      <View className="w-12 h-12 rounded-full bg-fintrack-background items-center justify-center">
        <Icon size={20} color="#545f73" />
      </View>
      
      <View className="flex-1 ml-4">
        <Text className="text-fintrack-onSurface font-manrope font-semibold text-base">
          {transaction.title}
        </Text>
        <Text className="text-fintrack-onSurfaceVariant font-manrope text-xs">
          {transaction.category} • {transaction.date}
        </Text>
      </View>
      
      <Text className={`font-publicSans font-semibold text-base ${isIncome ? 'text-fintrack-income' : 'text-fintrack-expense'}`}>
        {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
      </Text>
    </TouchableOpacity>
  );
}
