import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
const DEMO_AUTH_KEY = "bcb_demo_auth_user";
const DEMO_DEFAULT_PIN = "1234";

const makeDemoUser = ({
  accountNumber,
  fullName = "Demo Customer",
  accountType = "Savings Account",
  phone = "",
  kyc = {},
  transactionPin = DEMO_DEFAULT_PIN,
}) => ({
  id: accountNumber || "demo-user",
  full_name: fullName,
  email: `${accountNumber || "demo"}@bawjiasebank.demo`,
  accountNumber: accountNumber || "0000000000",
  accountType,
  phone,
  kyc,
  transactionPin,
  kycStatus: Object.keys(kyc).length ? "submitted" : "demo",
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings] = useState({ public_settings: { demoAuth: true } });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DEMO_AUTH_KEY);
      if (saved) {
        const parsedUser = JSON.parse(saved);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch {
      localStorage.removeItem(DEMO_AUTH_KEY);
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  }, []);

  const login = ({ accountNumber, password }) => {
    if (!accountNumber?.trim() || !password?.trim()) {
      setAuthError({ type: "demo_validation", message: "Account number and password are required" });
      return false;
    }

    const saved = localStorage.getItem(DEMO_AUTH_KEY);
    const savedUser = saved ? JSON.parse(saved) : null;
    const demoUser = savedUser?.accountNumber === accountNumber.trim()
      ? savedUser
      : makeDemoUser({ accountNumber: accountNumber.trim() });
    localStorage.setItem(DEMO_AUTH_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
    setIsAuthenticated(true);
    setAuthError(null);
    return true;
  };

  const register = ({ fullName, accountNumber, password, accountType, phone, kyc, transactionPin }) => {
    if (!fullName?.trim() || !accountNumber?.trim() || !password?.trim() || !transactionPin?.trim()) {
      setAuthError({ type: "demo_validation", message: "Name, account number, password, and PIN are required" });
      return false;
    }

    const demoUser = makeDemoUser({
      accountNumber: accountNumber.trim(),
      fullName: fullName.trim(),
      accountType,
      phone,
      kyc,
      transactionPin,
    });
    localStorage.setItem(DEMO_AUTH_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
    setIsAuthenticated(true);
    setAuthError(null);
    return true;
  };

  const logout = () => {
    localStorage.removeItem(DEMO_AUTH_KEY);
    setUser(null);
    setIsAuthenticated(false);
  };

  const resetPassword = ({ accountNumber, phone, otp, password }) => {
    if (!accountNumber?.trim() || !phone?.trim() || !otp?.trim() || !password?.trim()) {
      setAuthError({ type: "demo_validation", message: "All reset fields are required" });
      return false;
    }
    return login({ accountNumber, password });
  };

  const verifyTransactionPin = (pin) => pin === (user?.transactionPin || DEMO_DEFAULT_PIN);

  const navigateToLogin = () => {
    window.history.pushState({}, "", "/login");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const checkUserAuth = async () => Boolean(localStorage.getItem(DEMO_AUTH_KEY));
  const checkAppState = async () => true;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      authChecked,
      login,
      register,
      resetPassword,
      logout,
      verifyTransactionPin,
      navigateToLogin,
      checkUserAuth,
      checkAppState,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
