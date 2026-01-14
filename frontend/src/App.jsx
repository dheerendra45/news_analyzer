import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Landing from "./pages/Landing";
import Archive from "./pages/Archive";
import Reports from "./pages/Reports";
import ReportDetail from "./pages/ReportDetail";
import Login from "./pages/Login";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import CardsManager from "./pages/admin/CardsManager";
import ReportsManager from "./pages/admin/ReportsManager";

// Styles
import "./styles/landing.css";
import "./styles/archive.css";
import "./styles/admin-cards.css";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Landing />
            <Footer />
          </>
        }
      />
      <Route
        path="/archive"
        element={
          <>
            <Navbar />
            <Archive />
            <Footer />
          </>
        }
      />
      <Route
        path="/reports"
        element={
          <>
            <Navbar />
            <Reports />
            <Footer />
          </>
        }
      />
      <Route path="/report/:id" element={<ReportDetail />} />
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route path="cards" element={<CardsManager />} />
        <Route path="reports" element={<ReportsManager />} />
      </Route>
    </Routes>
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
