import Dashboard from './components/dashboard/Dashboard';
import ChatPage from './components/chatbot/ChatPage';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Header from './components/dashboard/Header';

function App() {

  return (
    <div className="app">

        <Header />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path='/chat' element={<ChatPage />} />
        </Routes>
    </div>
  );
}

export default App;
