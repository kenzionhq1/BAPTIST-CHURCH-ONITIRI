import { Outlet, useLocation } from "react-router-dom";
import CookieBanner from "../components/layouts/CookieBanner";
import Footer from "../components/layouts/Footer";
import Header from "../components/layouts/Header";

const MainLayout = () => {
  const location = useLocation();
  return (
    <div className="page-shell pattern-bg min-h-screen">
      <Header />
      <main className="relative z-10">
        <div key={location.pathname} className="page-fade">
          <Outlet />
        </div>
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
};

export default MainLayout;
