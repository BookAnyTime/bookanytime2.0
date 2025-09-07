// src/pages/Pages.tsx
import { useState } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext"; // Assuming you already have this
import { Button } from "@/components/ui/button";
import GenericPage from "./GenericPage";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Paper } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// About Page
export const About = () => (
  <GenericPage
    title="About Us"
    description={`Welcome to our platform! We are dedicated to helping you find the perfect stay anywhere in the world. Our team ensures verified listings, competitive prices, and 24/7 support to make your experience seamless.`}
  >
    <div className="mt-6 space-y-4 text-gray-700">
      <p>Founded in 2023, our mission is to make travel planning simple and trustworthy.</p>
      <p>We carefully verify all properties to ensure safety and comfort for our guests.</p>
      <p>Our team is passionate about connecting travelers with their ideal accommodations.</p>
    </div>
  </GenericPage>
);

// Contact Page
export const Contact = () => (
  <GenericPage
    title="Contact Us"
    description={`Have questions or need support? Reach out to us via the methods below, and we will get back to you as soon as possible.`}
  >
    <div className="mt-6 space-y-2 text-gray-700">
      <p><strong>Phone:</strong> +91 80881 83625</p>
      <p><strong>Email:</strong> support@example.com</p>
      <p><strong>Address:</strong> 123 Travel Street, Hyderabad, India</p>
      <p>Or fill out our <a href="/support" className="text-primary underline">Support Form</a> for detailed assistance.</p>
    </div>
  </GenericPage>
);

// Blog Page
export const Blog = () => (
  <GenericPage
    title="Blog"
    description={`Stay updated with the latest travel tips, property highlights, and platform news.`}
  >
    <div className="mt-6 space-y-4 text-gray-700">
      <article>
        <h3 className="text-xl font-semibold">Top 5 Farmhouses for Weekend Getaways</h3>
        <p>Discover the best farmhouses near Hyderabad for a relaxing weekend trip. Enjoy scenic views, private pools, and open lawns.</p>
      </article>
      <article>
        <h3 className="text-xl font-semibold">How to Choose Verified Properties</h3>
        <p>Learn how our verification process ensures safe and comfortable stays for all users.</p>
      </article>
      <article>
        <h3 className="text-xl font-semibold">Travel Tips for Families</h3>
        <p>Practical tips for planning trips with children, including property selection, activities, and safety measures.</p>
      </article>
    </div>
  </GenericPage>
);

// FAQ Page
export const FAQ = () => (
  <GenericPage
    title="FAQ"
    description="Frequently Asked Questions to help you get quick answers."
  >
    <div className="mt-6 text-gray-700">
      <Paper elevation={0} className="p-4">
        
        {/* Account & Profile */}
        <h4 className="mt-5 mb-3" style={{ color: "#0d6efd" }}>
          Account & Profile
        </h4>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography><strong>How Do I Create An Account?</strong></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Click On The <strong>"Signup"</strong> Button In The Header And Fill In Your Details. Once Submitted, Your Account Will Be Created And You Can Start Using <strong>BookAnytime</strong>.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Wishlist & Recently Viewed */}
        <h4 className="mt-5 mb-3" style={{ color: "#0d6efd" }}>
          Wishlist & Recently Viewed
        </h4>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography><strong>How Does The Wishlist Work?</strong></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Click The <span style={{ color: "red" }}>❤️ Heart Icon</span> On Any Property To Add It To Your Wishlist. You Can Organize And Revisit Wishlists Anytime.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography><strong>Can I Organize My Wishlist?</strong></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Yes! You Can Create Multiple Wishlists And Move Properties Between Them Via The <strong>Wishlist Page</strong>.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography><strong>What Is "Recently Viewed"?</strong></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              It Keeps Track Of Properties You’ve Browsed, So You Can Easily Return To Them Later.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Offers & Discounts */}
        <h4 className="mt-5 mb-3" style={{ color: "#0d6efd" }}>
          Offers & Discounts
        </h4>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography><strong>How Can I Apply Offers?</strong></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Offers Are Shown On The Homepage. Click An Offer To See Eligible Properties. Share The Offer Image With The Host On <span style={{ color: "green", fontWeight: "bold" }}>WhatsApp</span> During Booking.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography><strong>Are Offers Limited To Certain Properties?</strong></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Yes, Each Offer Is Valid Only For Selected Properties Or Categories. Full Details Are Listed On The Offer Page.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography><strong>Can I Combine Multiple Offers?</strong></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              No, Only One Offer Can Be Applied Per Booking Unless Specifically Mentioned Otherwise.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Cancellation & Refunds */}
        <h4 className="mt-5 mb-3" style={{ color: "#0d6efd" }}>
          Cancellation & Refunds
        </h4>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography><strong>How Can I Cancel A Booking?</strong></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Since Bookings Are Handled Via <span style={{ color: "green", fontWeight: "bold" }}>WhatsApp</span>, You’ll Need To Contact The Property Owner Directly To Cancel.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography><strong>Do I Get A Refund If I Cancel?</strong></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Refund Policies Are Managed Individually By Each Property. Please Confirm With The Owner During Booking.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography><strong>What If The Host Cancels My Booking?</strong></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              In Case Of Cancellation By The Host, You'll Be Notified Via <span style={{ color: "green", fontWeight: "bold" }}>WhatsApp</span>. You Can Then Review Alternative Properties.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Contact & Support */}
        <h4 className="mt-5 mb-3" style={{ color: "#0d6efd" }}>
          Contact & Support
        </h4>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography><strong>I Need Help Urgently — What Do I Do?</strong></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              For Urgent Help, Contact The Property Owner Via <span style={{ color: "green", fontWeight: "bold" }}>WhatsApp</span>. For Platform Issues, Use The “Feedback” Form Below.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography><strong>How Can I Contact The BookAnytime Team?</strong></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Email Us At <a href="mailto:support@bookanytime.com" style={{ color: "#1976d2", fontWeight: "bold" }}>Support@BookAnytime.Com</a> Or Use The Feedback Section. We’ll Respond As Quickly As Possible.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </div>
  </GenericPage>
);

// Terms & Conditions Page
export const Terms = () => (
  <GenericPage
    title="Terms & Conditions"
    description={`Please read these terms and conditions carefully before using our services.`}
  >
    <div className="mt-6 space-y-4 text-gray-700">
      <p>By accessing our platform, you agree to abide by our terms of use and policies.</p>
      <p>Booking a property constitutes acceptance of the property's rules and regulations.</p>
      <p>We reserve the right to modify these terms at any time; changes will be notified on our website.</p>
      <ul className="list-disc list-inside">
        <li>Respect other users and property owners.</li>
        <li>Provide accurate personal information during registration and booking.</li>
        <li>Follow cancellation and refund policies for each property.</li>
      </ul>
    </div>
  </GenericPage>
);

// Privacy Policy Page
export const Privacy = () => (
  <GenericPage
    title="Privacy Policy"
    description={`Your privacy is important to us. Learn how we collect, use, and protect your information.`}
  >
    <div className="mt-6 space-y-4 text-gray-700">
      <p>We collect personal information to provide a better user experience and process bookings.</p>
      <p>We do not share your information with third parties without consent except as required by law.</p>
      <p>All sensitive information is securely stored and encrypted.</p>
      <ul className="list-disc list-inside">
        <li>Account information</li>
        <li>Booking details</li>
        <li>Payment information</li>
      </ul>
    </div>
  </GenericPage>
);

// Support Page
export const Support = () => (
  <GenericPage
    title="Support"
    description={`We are here to assist you 24/7 with any issues or questions regarding your bookings.`}
  >
    <div className="mt-6 space-y-4 text-gray-700">
      <p>For urgent inquiries, call us at +91 80881 83625.</p>
      <p>Email us at support@example.com and we will respond within 24 hours.</p>
      <p>Access our <a href="/faq" className="text-primary underline">FAQ</a> for common questions and solutions.</p>
    </div>
  </GenericPage>
);


export const FeedBack = () => {
  const { isAuthenticated, user } = useAuth(); // user for signed in details
  const [formData, setFormData] = useState({
    description: "",
    email: user?.email || "bookanytimeinfo@gmail.com",
    phone: "+91 1234567890",
    username: user?.name || "Admin",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await axios.post("https://bookanytime-5adn.onrender.com/api/feedback", formData);
      setMessage("✅ Feedback submitted successfully!");
      setFormData({ ...formData, description: "" }); // clear only description
    } catch (err) {
      setMessage("❌ Failed to submit feedback. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GenericPage
      title="FeedBack"
      description="send us your feedback."
    >
      <div className="mt-6 space-y-6 text-gray-700">
        {/* Feedback Form (only if logged in) */}
        {isAuthenticated ? (
          <section>
            <h3 className="text-xl font-semibold mb-2">Submit Feedback</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md p-2"
                  rows={4}
                  placeholder="Share your feedback..."
                />
              </div>
              <div>
                <label className="block font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label className="block font-medium">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Feedback"}
              </Button>
            </form>
            {message && <p className="mt-2 text-sm">{message}</p>}
          </section>
        ) : (
          <p className="text-gray-500 italic">
            Please sign in to submit feedback.
          </p>
        )}
      </div>
    </GenericPage>
  );
};
