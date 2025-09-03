// src/pages/Pages.tsx
import GenericPage from "./GenericPage";

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
    description={`Frequently Asked Questions to help you get quick answers.`}
  >
    <div className="mt-6 space-y-4 text-gray-700">
      <p><strong>Q:</strong> How do I book a property?<br />
      <strong>A:</strong> Simply browse the property, select your dates, and click 'Book Now'.</p>

      <p><strong>Q:</strong> Can I cancel or modify my booking?<br />
      <strong>A:</strong> Yes! You can modify or cancel your booking directly from your account within the allowed policy.</p>

      <p><strong>Q:</strong> Are all properties verified?<br />
      <strong>A:</strong> Yes, each property undergoes a verification process to ensure quality and safety.</p>
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
