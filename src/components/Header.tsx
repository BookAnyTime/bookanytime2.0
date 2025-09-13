import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Home, Heart, LogOut, Map, User } from "lucide-react";
import DarkModeToggle from "@/DarkModeToggle";

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    // window.open("/", "_blank");
  };

  const isAdmin = user?.isAdmin ?? false;

  // Hide header if we are on any admin route
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 shadow-brand-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2" >
            <Home className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">BookAnytime</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              to="/wishlist"
              className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
              
            >
              <Heart className="h-5 w-5" />
              <span>Wishlist</span>
            </Link>

            {isAuthenticated && (
              <>
                <Button
                  asChild
                  variant="default"
                  className="bg-primary hover:bg-primary-hover"
                  
                >
                  <Link to="/list-property">List Your Property</Link>
                </Button>

                {isAdmin && (
                  <Button
                    asChild
                    variant="outline"
                    className="bg-secondary hover:bg-secondary-hover"
                  >
                    <button
                      className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary-hover text-center"
                      onClick={async () => {
                        await setMobileMenuOpen(false);
                        await document.documentElement.classList.toggle(
                          "dark",
                          false
                        );
                        await localStorage.setItem("dark-mode", "false");
                         navigate("/admin/properties");
                        // window.open("/admin/properties", "_blank");
                      }}
                    >
                      Admin Panel
                    </button>
                  </Button>
                )}

                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            )}

            {!isAuthenticated && (
              <>
                <Button
                  asChild
                  variant="default"
                  className="bg-primary hover:bg-primary-hover"
                >
                  <Link to="/list-property" >
                    List Your Property
                  </Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link to="/login" >
                    Login
                  </Link>
                </Button>
              </>
            )}

            {/* Dark Mode Toggle */}
            <DarkModeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <DarkModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="flex flex-col md:hidden mt-4 space-y-2">
            {isAuthenticated && (
              <>
                <Link
                  to="/wishlist"
                  className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                  
                >
                  <Heart className="h-5 w-5" />
                  <span>Wishlist</span>
                </Link>
                <Button
                  asChild
                  variant="default"
                  className="bg-primary hover:bg-primary-hover"
                >
                  <Link to="/list-property" >
                    List Your Property
                  </Link>
                </Button>

                {isAdmin && (
                  <button
                    className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary-hover text-center"
                    onClick={async () => {
                      await setMobileMenuOpen(false);
                      await document.documentElement.classList.toggle(
                        "dark",
                        false
                      );
                      await localStorage.setItem("dark-mode", "false");
                       navigate("/admin/properties");
                      // window.open("/admin/properties", "_blank");
                    }}
                  >
                    Admin Panel
                  </button>
                )}

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            )}

            {!isAuthenticated && (
              <>
                <Button>
                  <Link
                    to="/list-property"
                    onClick={() => setMobileMenuOpen(false)}
                    
                  >
                    List Your Property
                  </Link>
                </Button>
                <Link
                  to="/login"
                  className="text-foreground hover:text-primary transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                  
                >
                  Login
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

// export default Header;
