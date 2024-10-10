import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import Login from './pages/Login';
import Layout from './components/Layout';
import Houses from './pages/Houses';
import HouseDetails from './pages/HouseDetails';
import Payments from './pages/Payments';
import UserDetails from './pages/UserDetails';
import Partner from './pages/Partner'; // Updated
import PartnerDetails from './pages/PartnerDetails'; // Updated

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Set the root path to display the Dashboard */}
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/user-management" element={<Layout><UserManagement /></Layout>} />
        <Route path="/houses" element={<Layout><Houses /></Layout>} />
        <Route path="/houses/:id" element={<Layout><HouseDetails /></Layout>} />
        <Route path="/users/:id" element={<Layout><UserDetails /></Layout>} />
        <Route path="/partners" element={<Layout><Partner /></Layout>} /> {/* Corrected */}
        <Route path="/partners/:id" element={<Layout><PartnerDetails /></Layout>} /> {/* Corrected */}
        <Route path="/payments" element={<Layout><Payments /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
