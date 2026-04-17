import React from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import AppLayout from '@/components/banking/AppLayout';
import SplashScreen from '@/components/banking/SplashScreen';
import Dashboard from '@/pages/Dashboard';
import Transfer from '@/pages/Transfer';
import Cards from '@/pages/Cards';
import Payments from '@/pages/Payments';
import Notifications from '@/pages/Notifications';
import Transactions from '@/pages/Transactions';
import Settings from '@/pages/Settings';
import Loans from '@/pages/Loans';
import Savings from '@/pages/Savings';
import MoMo from '@/pages/MoMo';
import Budget from '@/pages/Budget';
import ATMLocator from '@/pages/ATMLocator';
import Support from '@/pages/Support';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const [showSplash, setShowSplash] = React.useState(() => !sessionStorage.getItem("splashShown"));

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  if (showSplash) {
    return <SplashScreen onComplete={() => { sessionStorage.setItem("splashShown", "1"); setShowSplash(false); }} />;
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/savings" element={<Savings />} />
        <Route path="/momo" element={<MoMo />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/atm" element={<ATMLocator />} />
        <Route path="/support" element={<Support />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App