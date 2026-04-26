import { create } from 'zustand';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  type: TransactionType;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
];

export const CATEGORIES = {
  expense: [
    { name: 'Food & Drink', icon: 'utensils' },
    { name: 'Transport', icon: 'car' },
    { name: 'Shopping', icon: 'shopping-bag' },
    { name: 'Entertainment', icon: 'play' },
    { name: 'Bills', icon: 'file-text' },
    { name: 'Other', icon: 'more-horizontal' },
  ],
  income: [
    { name: 'Salary', icon: 'briefcase' },
    { name: 'Freelance', icon: 'laptop' },
    { name: 'Investment', icon: 'trending-up' },
    { name: 'Gift', icon: 'gift' },
  ]
};

function formatDate(d: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;

  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface AppState {
  balance: number;
  weeklyBudget: number;
  transactions: Transaction[];
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  deleteTransaction: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  balance: 0.00,
  weeklyBudget: 500,
  transactions: [],
  currency: CURRENCIES[0], // USD default

  setCurrency: (currency) => set({ currency }),

  addTransaction: (newTx) => set((state) => {
    const amount = Number(newTx.amount);
    if (isNaN(amount) || amount <= 0) return state;

    const updatedBalance = newTx.type === 'income'
      ? state.balance + amount
      : state.balance - amount;

    const transaction: Transaction = {
      ...newTx,
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      date: formatDate(new Date()),
      amount: amount,
    };

    return {
      transactions: [transaction, ...state.transactions],
      balance: updatedBalance,
    };
  }),

  deleteTransaction: (id) => set((state) => {
    const txToDelete = state.transactions.find(t => t.id === id);
    if (!txToDelete) return state;

    const updatedBalance = txToDelete.type === 'income'
      ? state.balance - txToDelete.amount
      : state.balance + txToDelete.amount;

    return {
      transactions: state.transactions.filter(t => t.id !== id),
      balance: updatedBalance,
    };
  }),
}));
