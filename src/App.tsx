import React from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Header } from './components/Header';
import { HackathonDemoTour } from './components/HackathonDemoTour';
import { DesktopSidebar, MobileNavigation } from './components/Navigation';

// View Imports
import { DashboardView } from './components/views/DashboardView';
import { PassportView } from './components/views/PassportView';
import { CashFlowView } from './components/views/CashFlowView';
import { PaymentsView } from './components/views/PaymentsView';
import { CopilotView } from './components/views/CopilotView';
import { RiskMonitorView } from './components/views/RiskMonitorView';
import { TransactionsView } from './components/views/TransactionsView';
import { CreditReadinessView } from './components/views/CreditReadinessView';
import { AIInsightsView } from './components/views/AIInsightsView';
import { RecommendationsView } from './components/views/RecommendationsView';

// Modal Imports
import { BusinessDataModal } from './components/modals/BusinessDataModal';
import { VoiceModal } from './components/modals/VoiceModal';

const MainContent: React.FC = () => {
  const { activeTab } = useFinance();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'passport':
        return <PassportView />;
      case 'cashflow':
        return <CashFlowView />;
      case 'payments':
        return <PaymentsView />;
      case 'copilot':
        return <CopilotView />;
      case 'risk':
        return <RiskMonitorView />;
      case 'transactions':
        return <TransactionsView />;
      case 'credit':
        return <CreditReadinessView />;
      case 'insights':
        return <AIInsightsView />;
      case 'recommendations':
        return <RecommendationsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Header Bar */}
      <Header />

      {/* Guided Presentation Tour Banner */}
      <HackathonDemoTour />

      {/* Main Layout Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Desktop Navigation Sidebar */}
        <DesktopSidebar />

        {/* Dynamic Main View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNavigation />

      {/* Global Modals */}
      <BusinessDataModal />
      <VoiceModal />
    </div>
  );
};

export function App() {
  return (
    <FinanceProvider>
      <MainContent />
    </FinanceProvider>
  );
}

export default App;
