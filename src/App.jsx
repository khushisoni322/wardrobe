import { useState } from "react";

import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import MobileNavbar from "./components/layout/MobileNavbar";

import Dashboard from "./pages/Dashboard";
import MyWardrobe from "./pages/MyWardrobe";
import Categories from "./pages/Categories";
import Favorites from "./pages/Favorites";
import Outfits from "./pages/Outfits";
import Settings from "./pages/Settings";
import Family from "./pages/Family";
import Account from "./pages/Account";

const pages = {
  Dashboard,
  "My Wardrobe": MyWardrobe,
  Categories,
  Favorites,
  Outfits,
  Settings,
  Family,
  Account,
};

export default function App({ user, onLogout }) {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const CurrentPage = pages[activePage] || Dashboard;

  function handleNavigate(page) {
    setActivePage(page);
    setSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#F8F7FB] text-[#302640]">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen lg:ml-[260px]">
        <Topbar
          activePage={activePage}
          onMenuClick={() => setSidebarOpen(true)}
          onNavigate={handleNavigate}
          user={user}
          onLogout={onLogout}
        />

        <main className="mx-auto w-full max-w-[1700px] px-4 py-6 pb-28 sm:px-6 lg:px-9 lg:py-8">
          <CurrentPage
            user={user}
            onNavigate={handleNavigate}
            onLogout={onLogout}
          />
        </main>

        <MobileNavbar
          activePage={activePage}
          onNavigate={handleNavigate}
        />
      </div>
    </div>
  );
}