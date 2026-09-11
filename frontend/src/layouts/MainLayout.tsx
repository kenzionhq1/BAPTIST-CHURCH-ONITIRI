import { Outlet, useLocation } from "react-router-dom";
import CookieBanner from "../components/layouts/CookieBanner";
import Footer from "../components/layouts/Footer";
import Header from "../components/layouts/Header";
import MobileActionBar from "../components/common/MobileActionBar";

const MainLayout = () => {
  const location = useLocation();
  return (
    <div className="page-shell bg-[#F8FAFC] min-h-screen text-slate-900 flex flex-col justify-between">
      <div>
        <Header />
        <main className="relative z-10">
          <div key={location.pathname} className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
      <CookieBanner />
      <MobileActionBar />
    </div>
  );
};

export default MainLayout;
