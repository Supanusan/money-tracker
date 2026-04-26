<div align="center">

# 💰 FinTrack

### Your Personal Finance Companion

A beautifully crafted mobile expense tracker built with React Native & Expo

[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo_SDK_54-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📊 **Dashboard** | At-a-glance view of your balance, income vs expenses, and recent transactions |
| ➕ **Add Transactions** | Quick entry for both income and expenses with category selection |
| 📜 **Transaction History** | Complete list of all transactions with long-press to delete |
| 🍩 **Pie Chart Insights** | Beautiful donut charts showing expense & income breakdowns by category |
| 💱 **16 Currencies** | Switch between USD, EUR, GBP, JPY, INR, LKR, AUD, CAD, and more |
| 📈 **Spending Analysis** | Category breakdowns, savings rate, and key financial metrics |
| 🎨 **Premium Design** | Deep forest green theme with Manrope & Public Sans typography |

## 🏗️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Expo SDK 54** | Development framework & build tools |
| **Expo Router v6** | File-based navigation with tabs + modals |
| **React Native 0.81** | Cross-platform mobile UI |
| **TypeScript** | Type-safe development |
| **Zustand** | Lightweight global state management |
| **React Native SVG** | Custom donut/pie chart rendering |
| **Google Fonts** | Manrope (UI) + Public Sans (financial data) |

## 📱 Screens

### 🏠 Dashboard
- Personalized welcome greeting
- Balance card with weekly budget progress bar
- Income vs Expense stat cards
- Recent transactions list (last 5)
- Spending analysis with interactive donut chart
- Currency switcher button in header

### ➕ Add Transaction
- Toggle between Expense / Income
- Large amount input with currency symbol
- Title field for transaction description
- Category chip selector (6 expense + 4 income categories)
- Input validation with user-friendly alerts

### 📜 History
- Full scrollable transaction list
- Category icon, title, date, and amount for each entry
- Long-press to delete any transaction
- Empty state when no transactions exist

### 📊 Insights
- Total Spent / Total Earned summary cards
- Key metrics: Transaction count, Savings Rate, Balance
- Expense donut chart with detailed legend
- Income donut chart with source breakdown
- Category progress bars with percentages

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator (Mac) or Android Emulator, or [Expo Go](https://expo.dev/go) on your phone

### Installation

```bash
# Clone the repository
git clone https://github.com/Supanusan/money-tracker.git
cd money-tracker

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on Device

After starting the dev server:

- **📱 Expo Go**: Scan the QR code shown in terminal with the Expo Go app
- **🍎 iOS Simulator**: Press `i` in terminal
- **🤖 Android Emulator**: Press `a` in terminal

## 📂 Project Structure

```
money-tracker/
├── app/                          # Screens (Expo Router file-based routing)
│   ├── _layout.tsx               # Root stack navigator + font loading
│   ├── add.tsx                   # Add Transaction modal screen
│   └── (tabs)/                   # Tab navigator group
│       ├── _layout.tsx           # Tab bar configuration
│       ├── index.tsx             # Dashboard screen
│       ├── history.tsx           # Transaction history screen
│       └── insights.tsx          # Spending insights screen
├── components/
│   └── ui/
│       └── PieChart.tsx          # Custom SVG donut chart component
├── store/
│   └── useAppStore.ts            # Zustand store (transactions, balance, currency)
├── assets/                       # Images and fonts
├── app.json                      # Expo configuration
├── babel.config.js               # Babel config with Reanimated plugin
├── metro.config.js               # Metro bundler config
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript configuration
```

## 💱 Supported Currencies

| Currency | Symbol | Code |
|----------|--------|------|
| US Dollar | $ | USD |
| Euro | € | EUR |
| British Pound | £ | GBP |
| Japanese Yen | ¥ | JPY |
| Indian Rupee | ₹ | INR |
| Sri Lankan Rupee | Rs | LKR |
| Australian Dollar | A$ | AUD |
| Canadian Dollar | C$ | CAD |
| Swiss Franc | Fr | CHF |
| Chinese Yuan | ¥ | CNY |
| South Korean Won | ₩ | KRW |
| Singapore Dollar | S$ | SGD |
| Malaysian Ringgit | RM | MYR |
| Thai Baht | ฿ | THB |
| UAE Dirham | د.إ | AED |
| Brazilian Real | R$ | BRL |

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| **Primary** | `#003527` | Buttons, balance card, active states |
| **Background** | `#f4f6f3` | Screen backgrounds |
| **Surface** | `#ffffff` | Cards, inputs |
| **On Surface** | `#191c1b` | Primary text |
| **On Surface Variant** | `#545f73` | Secondary text, labels |
| **Income** | `#4caf50` | Income amounts, positive indicators |
| **Expense** | `#e53935` | Expense amounts, negative indicators |
| **Headline Font** | Manrope | UI labels, titles, navigation |
| **Data Font** | Public Sans | Amounts, percentages, financial data |

## 📋 Transaction Categories

**Expenses:** Food & Drink • Transport • Shopping • Entertainment • Bills • Other

**Income:** Salary • Freelance • Investment • Gift

## 🛠️ Key Dependencies

```json
{
  "expo": "~54.0.33",
  "expo-router": "~6.0.23",
  "react-native": "0.81.5",
  "zustand": "^5.0.12",
  "lucide-react-native": "^1.11.0",
  "react-native-svg": "15.15.4",
  "react-native-reanimated": "~4.1.1",
  "@expo-google-fonts/manrope": "^0.4.2",
  "@expo-google-fonts/public-sans": "^0.4.2"
}
```

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Supanusan**

- GitHub: [@Supanusan](https://github.com/Supanusan)

---

<div align="center">

Made with ❤️ using React Native & Expo

⭐ Star this repo if you find it useful!

</div>
