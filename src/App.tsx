
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Products from "./pages/Products";
import Wishlist from "./pages/Wishlist";
import ListProperty from "./pages/ListProperty";
import MapsView from "./pages/MapsView";
import Login from "./pages/Login";
import PropertyDetail from "./pages/PropertyDetail";
import NotFound from "./pages/NotFound";

// Components
import Header from "./components/Header";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./contexts/AdminRoute";
import AdminPanel from "./components/admin_panel/AdminPanel";
import Properties from "./components/admin_panel/properties/Properties";
import AddProperties from "./components/admin_panel/properties/AddProperties";
import UpdatePropertyPage from "./components/admin_panel/properties/UpdatePropertyPage";
import Offers from "./components/admin_panel/offers/OffersPage";
import TrackedData from "./components/admin_panel/tracked_data/TrackedData";
import ListYourPropertyLogs from "./components/admin_panel/list-your-property/ListPropertyLogs";
import FeedbackAdmin from "./components/admin_panel/feedback/FeedbackAdmin";
import Footer from "./components/Footer";
import { About, Blog, Contact, FAQ, Privacy, Support, Terms } from "./pages/About";
import OffersPage from "./pages/OffersPage";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Header />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route
                  path="/wishlist"
                  element={
                    <Wishlist />
                  }
                />
                <Route
                  path="/maps"
                  element={
                      <MapsView />
                  }
                />
                <Route path="/list-property" element={<ListProperty />} />
                <Route path="/login" element={<Login />} />
                <Route path="/property/:id" element={<PropertyDetail />} />
                <Route path="/offer/:id" element={<OffersPage />} />

                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminPanel />
                    </AdminRoute>
                  }
                >
                  <Route
                    path="properties"
                    element={
                      <AdminRoute>
                        <Properties />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="add-property"
                    element={
                      <AdminRoute>
                        <AddProperties />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="update-property/:id"
                    element={
                      <AdminRoute>
                        <UpdatePropertyPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="offers"
                    element={
                      <AdminRoute>
                        <Offers />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="trackData"
                    element={
                      <AdminRoute>
                        <TrackedData />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="list-property-logs"
                    element={
                      <AdminRoute>
                        <ListYourPropertyLogs />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="feedback-logs"
                    element={
                      <AdminRoute>
                        <FeedbackAdmin />
                      </AdminRoute>
                    }
                  />
                </Route>

                {/* extra pages */}

                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/support" element={<Support />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
