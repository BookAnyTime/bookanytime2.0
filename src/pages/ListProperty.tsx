import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Home } from "lucide-react";
import SEO from "@/components/SEO";

const ListProperty = () => {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    category: "",
  });

  const [formErrors, setFormErrors] = useState({
    phone: "",
    email: "",
  });

  // ✅ Auto-fill from localStorage if user is logged in
  useEffect(() => {
    const userStr = localStorage.getItem("user");

    window.scrollTo({
      top: 0,
      behavior: "smooth", // smooth scroll, optional
    });

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setFormData((prev) => ({
          ...prev,
          name: user.fullName || "",
          phone: user.phoneNumber || "",
          email: user.email || "",
        }));
      } catch (err) {
        console.error("Invalid user data in localStorage", err);
      }
    }
  }, []);

  const validatePhone = (phone: string) => {
    const phoneRegEx = /^\+91 \d{10}$/; // +91 followed by 10 digits
    return phoneRegEx.test(phone);
  };

  const validateEmail = (email: string) => {
    const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegEx.test(email);
  };

  // ✅ Check required fields
  const validateForm = () => {
    setFormErrors({ phone: "", email: "" });

    if (
      !formData.name ||
      !formData.phone ||
      !formData.email ||
      !formData.category
    ) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required details before proceeding.",
        variant: "destructive",
      });
      return false;
    }

    let valid = true;

    if (!validatePhone(formData.phone)) {
      setFormErrors((prev) => ({
        ...prev,
        phone:
          "Please enter a valid phone number (+91 <spaace> followed by 10 digits).",
      }));
      valid = false;
    }

    if (!validateEmail(formData.email)) {
      setFormErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address.",
      }));
      valid = false;
    }

    return valid;
  };

  // ✅ Submit to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/list-property`,
        formData
      );

      toast({
        title: "Property Submitted",
        description: "Your property details were sent successfully.",
      });

      setFormData({
        name: "",
        phone: "",
        email: "",
        category: "",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  // ✅ Contact via WhatsApp
  const handleWhatsApp = () => {
    if (!validateForm()) return;

    const message = `Hello, my name is ${formData.name}. I want to list my property.

📞 Phone: ${formData.phone}
📧 Email: ${formData.email}
🏠 Category: ${formData.category}`;

    const whatsappNumber = "918088183625"; // ✅ Without '+'
    const isMobile =
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      "ReactNativeWebView" in window || // ✅ Safe check
      navigator.userAgent.includes("wv"); // ✅ Detects Android WebView

    // ✅ Use wa.me for mobile, web.whatsapp for desktop
    const whatsappURL = isMobile
      ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
      : `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(
          message
        )}`;

    window.open(whatsappURL, "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <Home className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            List Your Property
          </h1>
          <p className="text-muted-foreground">
            Fill in your details to list your property with us
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Basic Info</CardTitle>
            <CardDescription>
              Provide your details to submit or contact via WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Your full name"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="+91 9876543210"
                  required
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="your@email.com"
                  required
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  placeholder="Enter property category (e.g. farmhouse, hotel)"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-hover"
                >
                  Submit
                  <div></div>
                </Button>
                <Button
                  type="button"
                  onClick={handleWhatsApp}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Contact via WhatsApp
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <SEO
        title="List Your Property in BookAnyTime | BookAnytime"
        description="Earn by listing your property on BookAnytime. Reach thousands of travelers looking for premium rentals in Hyderabad."
        keywords="list property Hyderabad, rent your property, Hyderabad vacation rental listing, BookAnytime property listing,list property in book any time"
        url={`${import.meta.env.VITE_URL}/list-property`}
      />
    </div>
  );
};

export default ListProperty;
