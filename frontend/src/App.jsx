import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import VerifyEmail from './pages/VerifyEmail';
import Browse from './pages/Browse';
import FoodDetails from './pages/FoodDetails';
import CreateListing from './pages/CreateListing';
import Dashboard from './pages/Dashboard';
import HowItWorks from './pages/HowItWorks';
import Safety from './pages/Safety';
import Contact from './pages/Contact';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="verify-email" element={<VerifyEmail />} />
        <Route path="browse" element={<Browse />} />
        <Route path="food/:id" element={<FoodDetails />} />
        <Route path="create" element={<CreateListing />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="safety" element={<Safety />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={
          <div className="max-w-2xl mx-auto px-4 py-24 text-center">
            <h1 className="text-6xl font-bold text-green-pale mb-4">404</h1>
            <h2 className="text-2xl font-bold text-green-deep mb-4">Page not found</h2>
            <p className="text-warm-gray mb-8">The page you're looking for doesn't exist or has been moved.</p>
            <a href="/" className="btn-primary">Go home</a>
          </div>
        } />
      </Route>
    </Routes>
  );
}
