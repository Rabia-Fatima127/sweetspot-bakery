import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { ProductsScreen } from './components/ProductsScreen';
import { ProductDetailScreen } from './components/ProductDetailScreen';
import { CartScreen } from './components/CartScreen';
import { AIAssistantModal } from './components/AIAssistantModal';
import { Footer } from './components/Footer';
import { MessageSquare, Sparkles, Check } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    activeScreen,
    setIsAssistantOpen,
    toastMessage
  } = useApp();

  return (
    <div className="min-h-screen bg-[#FAF6F2] text-[#3D312E] flex flex-col relative selection:bg-[#E3C4C1]/40">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 bg-[#3D312E] text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-2xl shadow-xl border border-[#5C4A47] flex items-center gap-2.5 animate-bounce">
          <div className="w-5 h-5 rounded-full bg-[#3D7A4D] flex items-center justify-center text-white">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <Header />

      {/* Dynamic Screen View */}
      <main className="flex-1">
        {activeScreen === 'home' && <HomeScreen />}
        {activeScreen === 'products' && <ProductsScreen />}
        {activeScreen === 'detail' && <ProductDetailScreen />}
        {activeScreen === 'cart' && <CartScreen />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Chat Bubble Button (Matching Screenshots 2, 4, 5) */}
      <button
        id="floating-ai-assistant-btn"
        onClick={() => setIsAssistantOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#635350] hover:bg-[#473937] text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 cursor-pointer border-2 border-[#FAF6F2]"
        aria-label="Open AI Pastry Concierge"
      >
        <div className="relative">
          <MessageSquare className="w-6 h-6 fill-white" />
          <Sparkles className="w-3 h-3 text-[#E3A8A3] absolute -top-1 -right-1 animate-ping" />
        </div>
      </button>

      {/* AI Assistant Modal / Drawer */}
      <AIAssistantModal />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
