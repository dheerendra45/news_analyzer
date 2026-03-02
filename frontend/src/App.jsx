import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth Pages
import Landing from "./pages/Landing";
import Archive from "./pages/Archive";
import ReportDetail from "./pages/ReportDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import CardsManager from "./pages/admin/CardsManager";
import ReportsManager from "./pages/admin/ReportsManager";

// Styles
import "./styles/landing.css";
import "./styles/archive.css";
import "./styles/admin-cards.css";

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/register"];
  const hideFooterRoutes = ["/login", "/register", "/admin"];

  // ReportDetail has its own navbar/footer
  const isReportPage = location.pathname.startsWith("/report/");

  const shouldShowNavbar =
    !hideNavbarRoutes.includes(location.pathname) && !isReportPage;
  const shouldShowFooter =
    !hideFooterRoutes.some((route) => location.pathname.startsWith(route)) &&
    !isReportPage;

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <main>{children}</main>
      {shouldShowFooter && <Footer />}
    </>
  );
};

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        {/* Auth Routes (public) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes - require login */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Landing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/archive"
          element={
            <ProtectedRoute>
              <Archive />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report/:id"
          element={
            <ProtectedRoute>
              <ReportDetail />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/cards"
          element={
            <ProtectedRoute adminOnly>
              <CardsManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute adminOnly>
              <ReportsManager />
            </ProtectedRoute>
          }
        />

        {/* Catch-all 404 - Redirect to login */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <AppRoutes />
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#0f0f0f",
              color: "#fff",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: "#059669",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#c41e3a",
                secondary: "#fff",
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
