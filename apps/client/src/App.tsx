import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import ResultsPage from './pages/ResultsPage';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import TicketPage from './pages/TicketPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import OtpPage from './pages/auth/OtpPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/reservation/:id" element={<BookingPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/tickets/:id" element={<TicketPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/otp" element={<OtpPage />} />
      </Routes>
    </Router>
  );
}

export default App;
