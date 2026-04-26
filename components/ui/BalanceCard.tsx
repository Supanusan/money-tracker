import React from 'react';
import { View, Text } from 'react-native';
import { Card } from './Card';
import { useAppStore } from '@/store/useAppStore';

export function BalanceCard() {
  const { balance, weeklyBudget, transactions } = useAppStore();
  
  // Calculate spent this week (just a mock for now based on current transactions)
  const spentThisWeek = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);
    
  const progress = Math.min(spentThisWeek / weeklyBudget, 1);

  return (
    <Card className="bg-fintrack-primary p-0 overflow-hidden border-0">
      <View className="p-6">
        <Text className="text-fintrack-background/70 font-manrope text-sm mb-1">
          Total Balance
        </Text>
        <Text className="text-white font-publicSans font-bold text-4xl mb-6">
          ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </Text>
        
        <View className="bg-fintrack-primaryContainer/50 rounded-xl p-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-white font-manrope font-semibold text-sm">
              Weekly Budget
            </Text>
            <Text className="text-white/70 font-publicSans text-xs">
              ${spentThisWeek.toFixed(0)} / ${weeklyBudget}
            </Text>
          </View>
          
          <View className="h-2 bg-white/10 rounded-full overflow-hidden">
            <View 
              className="h-full bg-fintrack-income" 
              style={{ width: `${progress * 100}%` }} 
            />
          </View>
        </View>
      </View>
    </Card>
  );
}
