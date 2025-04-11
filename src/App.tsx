import { useState } from 'react';
import Dashboard from './components/dashboard/Dashboard';
import ChatPage from './components/chatbot/ChatPage';
import './App.css';

function App() {
  // Basit bir geçiş için - gerçek projelerde router kullanılmalı
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'chat'>('dashboard');

  return (
    <div className="app">
      {currentPage === 'dashboard' && <Dashboard onChatOpen={() => setCurrentPage('chat')} />}
      {currentPage === 'chat' && <ChatPage onBack={() => setCurrentPage('dashboard')} />}
    </div>
  );
}

export default App;
