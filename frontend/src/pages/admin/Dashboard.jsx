import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { intelligenceCardsAPI } from "../../api/intelligenceCards";
import { reportsAPI } from "../../api/reports";
import {
  LayoutDashboard,
  LayoutGrid,
  FileText,
  Settings,
  ChevronRight,
  TrendingUp,
  Users,
  Eye,
  Star,
  Menu,
  X,
  RefreshCw,
} from "lucide-react";

const Dashboard = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalCards: 0,
    publishedCards: 0,
    draftCards: 0,
    featuredCards: 0,
    totalReports: 0,
    publishedReports: 0,
    draftReports: 0,
  });

  const isActive = (path) => location.pathname === path;
  const isSection = (path) => location.pathname.startsWith(path);

  const fetchStats = async () => {
    setRefreshing(true);
    try {
      const [cardsStats, reportsPublished, reportsDraft] = await Promise.all([
        intelligenceCardsAPI.getAdminStats(),
        reportsAPI.getAll({ status: "published", size: 1 }),
        reportsAPI.getAll({ status: "draft", size: 1 }),
      ]);

      setStats({
        totalCards: cardsStats.total_cards || 0,
        publishedCards: cardsStats.published_cards || 0,
        draftCards: cardsStats.draft_cards || 0,
        featuredCards: cardsStats.featured_cards || 0,
        totalReports: (reportsPublished.total || 0) + (reportsDraft.total || 0),
        publishedReports: reportsPublished.total || 0,
        draftReports: reportsDraft.total || 0,
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Overview", exact: true },
    { path: "/admin/cards", icon: LayoutGrid, label: "Intelligence Cards" },
    { path: "/admin/reports", icon: FileText, label: "Reports Manager" },
  ];

  const Sidebar = () => (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 w-64 bg-black text-white min-h-screen transform transition-transform duration-300 lg:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4 sm:p-6 border-b border-white/10 flex justify-between items-center">
          <div>
            <Link
              to="/"
              className="font-playfair text-lg sm:text-xl text-white hover:text-crimson transition-colors"
            >
              Replace<span className="text-crimson">able</span>.ai
            </Link>
            <p className="font-inter text-xs text-mist mt-1">Admin Dashboard</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white p-1"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.exact
              ? isActive(item.path)
              : isSection(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 mb-1 transition-colors ${
                  active
                    ? "bg-crimson text-white"
                    : "text-titanium hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span className="font-inter text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-crimson flex items-center justify-center flex-shrink-0">
              <span className="font-inter text-sm font-bold text-white">
                {user?.username?.[0]?.toUpperCase() || "A"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-inter text-sm text-white truncate">
                {user?.username}
              </p>
              <p className="font-inter text-xs text-mist truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );

  const MobileHeader = () => (
    <div className="lg:hidden sticky top-0 z-30 bg-black text-white px-4 py-3 flex items-center justify-between">
      <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2">
        <Menu size={24} />
      </button>
      <Link to="/" className="font-playfair text-lg text-white">
        Replace<span className="text-crimson">able</span>.ai
      </Link>
      <div className="w-8" /> {/* Spacer for centering */}
    </div>
  );

  // If we're at a nested route, show the outlet
  if (location.pathname !== "/admin") {
    return (
      <div className="min-h-screen bg-[#f4f5f3] lg:flex pt-16">
        <MobileHeader />
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    );
  }

  // Dashboard Overview
  return (
    <div className="min-h-screen bg-[#f4f5f3] lg:flex pt-16">
      <MobileHeader />
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-playfair text-2xl sm:text-3xl mb-2 text-black">
                Dashboard Overview
              </h1>
              <p className="font-crimson text-base sm:text-lg text-gray-600">
                Welcome back, {user?.username}. Here's what's happening with
                your content.
              </p>
            </div>
            <button
              onClick={fetchStats}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-crimson text-white hover:bg-crimson/90 transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-white border border-platinum p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <LayoutGrid className="text-crimson" size={20} />
              <span className="font-inter text-[10px] sm:text-xs text-green-500 flex items-center gap-1">
                <TrendingUp size={10} />
                Active
              </span>
            </div>
            <div className="font-playfair text-2xl sm:text-3xl mb-1">
              {stats.totalCards}
            </div>
            <div className="font-inter text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
              Total Cards
            </div>
          </div>

          <div className="bg-white border border-platinum p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <Eye className="text-teal" size={20} />
            </div>
            <div className="font-playfair text-2xl sm:text-3xl mb-1">
              {stats.publishedCards}
            </div>
            <div className="font-inter text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
              Published Cards
            </div>
          </div>

          <div className="bg-white border border-platinum p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <Star className="text-gold" size={20} />
            </div>
            <div className="font-playfair text-2xl sm:text-3xl mb-1">
              {stats.featuredCards}
            </div>
            <div className="font-inter text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
              Featured Cards
            </div>
          </div>

          <div className="bg-white border border-platinum p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <FileText className="text-gold" size={20} />
            </div>
            <div className="font-playfair text-2xl sm:text-3xl mb-1">
              {stats.totalReports}
            </div>
            <div className="font-inter text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
              Total Reports
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Link
            to="/admin/cards"
            className="bg-white border border-platinum p-4 sm:p-6 hover:border-crimson transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="font-playfair text-lg sm:text-xl mb-2">
                  Manage Intelligence Cards
                </h3>
                <p className="font-crimson text-sm sm:text-base text-gray-600">
                  Create, edit, and publish landing page cards
                </p>
                <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-4 font-inter text-xs sm:text-sm">
                  <span className="text-green-600">
                    {stats.publishedCards} Published
                  </span>
                  <span className="text-yellow-600">
                    {stats.draftCards} Drafts
                  </span>
                </div>
              </div>
              <ChevronRight
                className="text-gray-300 group-hover:text-crimson transition-colors flex-shrink-0 ml-2"
                size={24}
              />
            </div>
          </Link>

          <Link
            to="/admin/reports"
            className="bg-white border border-platinum p-4 sm:p-6 hover:border-crimson transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="font-playfair text-lg sm:text-xl mb-2">
                  Manage Reports
                </h3>
                <p className="font-crimson text-sm sm:text-base text-gray-600">
                  Create, edit, and publish research reports
                </p>
                <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-4 font-inter text-xs sm:text-sm">
                  <span className="text-green-600">
                    {stats.publishedReports} Published
                  </span>
                  <span className="text-yellow-600">
                    {stats.draftReports} Drafts
                  </span>
                </div>
              </div>
              <ChevronRight
                className="text-gray-300 group-hover:text-crimson transition-colors flex-shrink-0 ml-2"
                size={24}
              />
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
