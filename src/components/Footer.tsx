import DarkModeToggle from "@/DarkModeToggle";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 z-50">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* About / Logo */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">BookAnywhere</h3>
          <p className="text-sm text-gray-400 mb-4">
            Discover and book the best stays around the world. Comfortable, verified, and affordable properties.
          </p>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Facebook className="w-5 h-5 hover:text-white transition-colors" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Twitter className="w-5 h-5 hover:text-white transition-colors" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram className="w-5 h-5 hover:text-white transition-colors" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <Linkedin className="w-5 h-5 hover:text-white transition-colors" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-white transition-colors">Properties</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
            </li>
          </ul>
        </div>

        {/* Help & Support */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Help & Support</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/support" className="hover:text-white transition-colors">Support</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center">
              <Phone className="w-4 h-4 mr-2" /> +91 80881 83625
            </li>
            <li className="flex items-center">
              <Mail className="w-4 h-4 mr-2" /> support@bookanywhere.com
            </li>
            <li className="flex items-center">
              <Globe className="w-4 h-4 mr-2" /> www.bookanywhere.com
            </li>
            <li className="mt-4 text-sm text-gray-500">
              &copy; {new Date().getFullYear()} BookAnywhere. All rights reserved.
            </li>
          </ul>
        </div>

             

      </div>
    </footer>
  );
};

export default Footer;
