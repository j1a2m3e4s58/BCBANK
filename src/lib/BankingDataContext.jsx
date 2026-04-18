import React, { createContext, useContext, useMemo, useState } from "react";
import {
  sampleBeneficiaries,
  sampleCards,
  sampleNotifications,
  sampleTransactions,
  userProfile,
} from "@/lib/sampleData";

const BankingDataContext = createContext(null);
const STORAGE_KEY = "bcb_demo_banking_state_v1";

const parseAmount = (value) => {
  if (typeof value === "number") return value;
  return Number(String(value).replace(/,/g, "")) || 0;
};

const formatAmount = (value) =>
  parseAmount(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const todayParts = () => {
  const now = new Date();
  return {
    date: now.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    time: now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    iso: now.toISOString(),
  };
};

const makeReference = (prefix = "BCB") => `${prefix}${Date.now().toString().slice(-8)}`;

const initialState = {
  userProfile,
  balance: 24850,
  transactions: sampleTransactions,
  notifications: sampleNotifications,
  beneficiaries: sampleBeneficiaries,
  cards: sampleCards,
  cardSettings: {
    onlinePurchases: true,
    intlTransactions: false,
    contactless: true,
    atmWithdrawal: true,
  },
  savingsGoals: [
    { id: 1, name: "New Car", target: 30000, saved: 12500, color: "from-primary/30 to-primary/5", emoji: "Car", deadline: "Dec 2026" },
    { id: 2, name: "Holiday Trip", target: 8000, saved: 6200, color: "from-purple-500/30 to-purple-500/5", emoji: "Trip", deadline: "Aug 2026" },
    { id: 3, name: "Emergency Fund", target: 10000, saved: 10000, color: "from-green-500/30 to-green-500/5", emoji: "Safe", deadline: "Completed" },
  ],
  budgets: [
    { id: 1, category: "food", limit: 800, spent: 650 },
    { id: 2, category: "shopping", limit: 500, spent: 890 },
    { id: 3, category: "utilities", limit: 400, spent: 320 },
    { id: 4, category: "internet", limit: 200, spent: 99 },
  ],
};

const loadState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
  } catch {
    return initialState;
  }
};

export function BankingDataProvider({ children }) {
  const [state, setState] = useState(loadState);

  const updateState = (updater) => {
    setState((current) => {
      const next = typeof updater === "function" ? updater(current) : updater;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const addNotification = ({ title, message, type = "info" }) => {
    updateState((current) => ({
      ...current,
      notifications: [
        { id: Date.now(), title, message, time: "Just now", read: false, type },
        ...current.notifications,
      ],
    }));
  };

  const addTransaction = ({ name, category, type = "debit", amount, status = "completed", referencePrefix = "BCB", details = {} }) => {
    const txAmount = parseAmount(amount);
    const { date, time, iso } = todayParts();
    const transaction = {
      id: Date.now(),
      reference: makeReference(referencePrefix),
      name,
      category,
      type,
      amount: formatAmount(txAmount),
      date,
      time,
      iso,
      status,
      details,
    };

    updateState((current) => ({
      ...current,
      balance: type === "credit" ? current.balance + txAmount : current.balance - txAmount,
      transactions: [transaction, ...current.transactions],
    }));

    return transaction;
  };

  const addBeneficiary = ({ name, bank, account }) => {
    const initials = name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const beneficiary = {
      id: Date.now(),
      name,
      bank,
      account: account.startsWith("****") ? account : `****${account.slice(-4)}`,
      avatar: initials || "BC",
    };
    updateState((current) => ({
      ...current,
      beneficiaries: [beneficiary, ...current.beneficiaries],
    }));
    return beneficiary;
  };

  const updateBeneficiary = (id, updates) => {
    updateState((current) => ({
      ...current,
      beneficiaries: current.beneficiaries.map((beneficiary) =>
        beneficiary.id === id ? { ...beneficiary, ...updates } : beneficiary
      ),
    }));
  };

  const deleteBeneficiary = (id) => {
    updateState((current) => ({
      ...current,
      beneficiaries: current.beneficiaries.filter((beneficiary) => beneficiary.id !== id),
    }));
  };

  const value = useMemo(() => ({
    ...state,
    formatAmount,
    addTransaction,
    addNotification,
    addBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
    setNotifications: (notifications) => updateState((current) => ({
      ...current,
      notifications: typeof notifications === "function" ? notifications(current.notifications) : notifications,
    })),
    setCardSettings: (cardSettings) => updateState((current) => ({
      ...current,
      cardSettings: typeof cardSettings === "function" ? cardSettings(current.cardSettings) : cardSettings,
    })),
    setSavingsGoals: (savingsGoals) => updateState((current) => ({
      ...current,
      savingsGoals: typeof savingsGoals === "function" ? savingsGoals(current.savingsGoals) : savingsGoals,
    })),
    setBudgets: (budgets) => updateState((current) => ({
      ...current,
      budgets: typeof budgets === "function" ? budgets(current.budgets) : budgets,
    })),
    resetDemoData: () => updateState(initialState),
  }), [state]);

  return (
    <BankingDataContext.Provider value={value}>
      {children}
    </BankingDataContext.Provider>
  );
}

export function useBankingData() {
  const context = useContext(BankingDataContext);
  if (!context) {
    throw new Error("useBankingData must be used within BankingDataProvider");
  }
  return context;
}
