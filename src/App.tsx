import Dashboard from './components/dashboard/Dashboard';
import ChatPage from './components/chatbot/ChatPage';
import './App.css';
import { Route, Routes } from 'react-router-dom';


function App() {

  return (
    <div className="app font-roboto">

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path='/chat' element={<ChatPage />} />
        </Routes>
    </div>
  );
}

export default App;
