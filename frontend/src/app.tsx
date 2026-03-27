import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import SermonsPage from "./pages/SermonsPage";
import EventsPage from "./pages/EventsPage";
import ResourcesPage from "./pages/ResourcesPage";
import GivingPage from "./pages/GivingPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import CookiesPage from "./pages/CookiesPage";
import AdminPage from "./pages/AdminPage";
import HelpPage from "./pages/HelpPage";

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/sermons" element={<SermonsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/giving" element={<GivingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy-policy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
