// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Star, MapPin, ArrowRight } from "lucide-react";
// import heroImage from "@/assets/hero-image.jpg";
// import SEO from "@/components/SEO";

// const Index = () => {
//   const [categories, setCategories] = useState([]);
//   const [loadingCategories, setLoadingCategories] = useState(true);

//   const [offers, setOffers] = useState([]);
//   const [loadingOffers, setLoadingOffers] = useState(true);

//   const [featuredProperties, setFeaturedProperties] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const whyChooseUs = [
//     {
//       id: 1,
//       title: "Best Price Guarantee",
//       description:
//         "We offer the best prices on all properties with no hidden fees.",
//       icon: "💰",
//     },
//     {
//       id: 2,
//       title: "Verified Properties",
//       description:
//         "All listings are verified to ensure a safe and trustworthy stay.",
//       icon: "✔️",
//     },
//     {
//       id: 3,
//       title: "24/7 Support",
//       description:
//         "Our team is available around the clock to help you anytime.",
//       icon: "📞",
//     },
//     {
//       id: 4,
//       title: "Flexible Booking",
//       description: "Easily modify or cancel your booking without hassle.",
//       icon: "🛏️",
//     },
//   ];

//   useEffect(() => {
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth", // smooth scroll, optional
//     });
//   }, []);

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get(
//           `${import.meta.env.VITE_API_URL}/api/categories`
//         );
//         if (Array.isArray(res.data)) setCategories(res.data);
//         else if (res.data.category) setCategories([res.data.category]);
//       } catch (err) {
//         console.error("Error fetching categories:", err);
//       } finally {
//         setLoadingCategories(false);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch offers
//   useEffect(() => {
//     const fetchOffers = async () => {
//       try {
//         const res = await axios.get(
//           `${import.meta.env.VITE_API_URL}/api/offers`
//         );
//         setOffers(res.data || []);
//       } catch (err) {
//         console.error("Error fetching offers:", err);
//       } finally {
//         setLoadingOffers(false);
//       }
//     };
//     fetchOffers();
//   }, []);

//   useEffect(() => {
//     let currentIndex = 0;

//     const interval = setInterval(() => {
//       const carousel = document.getElementById("offers-carousel");
//       if (!carousel) return;

//       currentIndex = (currentIndex + 1) % offers.length;
//       carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
//     }, 4000);

//     return () => clearInterval(interval);
//   }, [offers]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev === offers.length - 1 ? 0 : prev + 1));
//     }, 4000);
//     return () => clearInterval(interval);
//   }, [offers]);

//   // Load featured properties from localStorage
//   useEffect(() => {
//     try {
//       const stored = localStorage.getItem("recentlyViewed");
//       if (stored) {
//         const parsed = JSON.parse(stored);
//         if (Array.isArray(parsed)) setFeaturedProperties(parsed);
//       }
//     } catch (err) {
//       console.error("Error parsing recentlyViewed:", err);
//     }
//   }, []);

//   // Auto-scroll effect for offers
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const container = document.getElementById("offers-container");
//       if (container) container.scrollBy({ left: 300, behavior: "smooth" });
//     }, 4000);

//     return () => clearInterval(interval);
//   }, [offers]);

//   return (
//     <div className="min-h-screen">
//       {/* Hero Section */}
//       <section className="relative h-screen flex items-center justify-center overflow-hidden">
//         <div
//           className="absolute inset-0 bg-cover bg-center"
//           style={{ backgroundImage: `url(${heroImage})` }}
//         >
//           <div className="absolute inset-0 bg-black/40"></div>
//         </div>

//         <div className="relative z-10 text-center text-white px-4">
//           <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
//             Find Your Perfect Stay
//           </h1>
//           <p className="text-xl md:text-2xl mb-8 animate-slide-up text-white ">
//             Discover amazing places around the world
//           </p>
//           <Button
//             asChild
//             size="lg"
//             className="bg-primary hover:bg-primary-hover text-lg px-8 py-4 animate-scale-in"
//           >
//             <Link to="/products">Start Exploring</Link>
//           </Button>
//         </div>
//       </section>

//       {/* Special Offers Section */}
//       <section className="py-16 bg-background">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-12">
//             Special Offers
//           </h2>

//           {loadingOffers ? (
//             <p className="text-center text-muted-foreground">
//               Loading offers...
//             </p>
//           ) : offers.length === 0 ? (
//             <p className="text-center text-muted-foreground">
//               No offers available
//             </p>
//           ) : (
//             <div className="relative w-full overflow-hidden">
//               {/* Offers wrapper */}
//               <div
//                 id="offers-carousel"
//                 className="flex transition-transform duration-700"
//                 style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//               >
//                 {offers.map((offer) => (
//                   <div
//                     key={offer._id}
//                     className="w-full relative flex-shrink-0 h-[400px] md:h-[500px]"
//                   >
//                     <Link
//                       key={offer._id}
//                       to={`/products?category=${offer.category
//                         ?.toLowerCase()
//                         .replace(/\s+/g, "-")}`}
//                       className="group"
//                     >
//                       <img
//                         src={
//                           offer.image && offer.image.length > 0
//                             ? `${import.meta.env.VITE_API_URL}${offer.image[0]}`
//                             : "https://placehold.co/1200x500"
//                         }
//                         alt={offer.category}
//                         className="w-full h-full object-cover object-center"
//                       />
//                       <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center md:items-start p-8 md:p-16 text-white text-center md:text-left">
//                         <Badge className="mb-4 bg-secondary text-secondary-foreground">
//                           {offer.category}
//                         </Badge>
//                         <h3 className="text-3xl md:text-5xl font-bold mb-2">
//                           {offer.properties?.map((p) => p.name).join(", ") ||
//                             "Special Offer"}
//                         </h3>
//                         <p className="text-lg md:text-xl">
//                           {new Date(offer.startDate).toLocaleDateString()} –{" "}
//                           {new Date(offer.endDate).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </Link>
//                   </div>
//                 ))}
//               </div>

//               {/* Arrows */}
//               <button
//                 onClick={() =>
//                   setCurrentIndex((prev) =>
//                     prev === 0 ? offers.length - 1 : prev - 1
//                   )
//                 }
//                 className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 text-white transition-colors"
//               >
//                 <ChevronLeft className="w-6 h-6" />
//               </button>
//               <button
//                 onClick={() =>
//                   setCurrentIndex((prev) =>
//                     prev === offers.length - 1 ? 0 : prev + 1
//                   )
//                 }
//                 className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 text-white transition-colors"
//               >
//                 <ChevronRight className="w-6 h-6" />
//               </button>

//               {/* Dots */}
//               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
//                 {offers.map((_, index) => (
//                   <span
//                     key={index}
//                     className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
//                       index === currentIndex ? "bg-white" : "bg-white/50"
//                     }`}
//                     onClick={() => setCurrentIndex(index)}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Categories Section */}
//       <section className="py-16">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-12">
//             Browse by Category
//           </h2>
//           {loadingCategories ? (
//             <p className="text-center text-muted-foreground">
//               Loading categories...
//             </p>
//           ) : categories.length === 0 ? (
//             <p className="text-center text-muted-foreground">
//               No categories available
//             </p>
//           ) : (
//             <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
//               {categories.map((category) => (
//                 <Link
//                   key={category._id}
//                   to={`/products?category=${category.name
//                     ?.toLowerCase()
//                     .replace(/\s+/g, "-")}`}
//                   className="group"
//                 >
//                   <Card className="hover:shadow-brand-lg transition-all duration-300 group-hover:scale-105">
//                     <CardContent className="p-0">
//                       <img
//                         src={category.image || "https://placehold.co/600x400"}
//                         alt={category.name}
//                         className="w-full h-32 object-cover rounded-t-lg"
//                       />
//                       <div className="p-4 text-center">
//                         <h3 className="font-semibold">{category.name}</h3>
//                         <p className="text-sm text-muted-foreground">
//                           Explore now
//                         </p>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </Link>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Recently Viewed Properties Section */}
//       <section className="py-12">
//         <div className="container mx-auto px-4">
//           <div className="flex justify-between items-center mb-8">
//             <h2 className="text-2xl md:text-3xl font-bold">
//               Recently Viewed Properties
//             </h2>
//             <Button variant="outline" asChild size="sm">
//               <Link to="/products" className="flex items-center">
//                 View All <ArrowRight className="ml-2 h-4 w-4" />
//               </Link>
//             </Button>
//           </div>

//           {featuredProperties.length === 0 ? (
//             <p className="text-center text-muted-foreground">
//               No recently viewed properties available
//             </p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
//               {featuredProperties.slice(0, 3).map((property) => (
//                 <Card
//                   key={property.id}
//                   className="hover:shadow-brand-md transition-shadow group"
//                 >
//                   <CardContent className="p-0">
//                     <img
//                       src={property.image}
//                       alt={property.name}
//                       className="w-full h-32 md:h-36 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
//                     />
//                     <div className="p-4">
//                       <h3 className="text-lg font-semibold mb-1">
//                         {property.name}
//                       </h3>
//                       <div className="flex items-center text-muted-foreground text-sm mb-2">
//                         <MapPin className="h-3 w-3 mr-1" />
//                         {property.city}
//                       </div>
//                       <div className="flex justify-between items-center text-sm">
//                         <span className="font-bold">
//                           ₹{property.minPrice} - ₹{property.maxPrice}
//                           <span className="text-xs text-muted-foreground">
//                             /night
//                           </span>
//                         </span>
//                         <Button size="sm" asChild>
//                           <Link to={`/property/${property.id}`}>View</Link>
//                         </Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       <section className="px-10 py-2">
//         <div className="max-w-100 px-12 x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex items-center justify-between space-x-4">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//               Are you a property owner?
//             </h3>
//             <p className="text-sm text-gray-600 dark:text-gray-300">
//               List your property on our platform and reach more travelers
//             </p>
//           </div>
//           <Link to="/list-property">
//           <Button>
//             add Your Property
//           </Button>
//           </Link>
//         </div>
//       </section>

//       {/* Why Choose Us Section */}
//       <section className="py-16">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-12">
//             Why Choose Us
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//             {whyChooseUs.map((item) => (
//               <Card
//                 key={item.id}
//                 className="hover:shadow-brand-lg transition-transform duration-300 group"
//               >
//                 <CardContent className="p-6 text-center">
//                   <div className="text-5xl mb-4">{item.icon}</div>
//                   <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
//                   <p className="text-muted-foreground">{item.description}</p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       <SEO
//         title="BookAnytime | Best Vacation Rentals in Hyderabad"
//         description="BookAnytime offers the best properties for rent in Hyderabad. Explore farmhouses, villas, and luxury stays for short or long term stays."
//         keywords="Hyderabad vacation rentals, Hyderabad villas, Hyderabad farmhouses, BookAnytime"
//         url="https://bookanytime.in/"
//       />
//     </div>
//   );
// };

// export default Index;

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import SEO from "@/components/SEO";

const Index = () => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [offers, setOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(true);

  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const whyChooseUs = [
    {
      id: 1,
      title: "Best Price Guarantee",
      description:
        "We offer the best prices on all properties with no hidden fees.",
      icon: "💰",
    },
    {
      id: 2,
      title: "Verified Properties",
      description:
        "All listings are verified to ensure a safe and trustworthy stay.",
      icon: "✔️",
    },
    {
      id: 3,
      title: "24/7 Support",
      description:
        "Our team is available around the clock to help you anytime.",
      icon: "📞",
    },
    {
      id: 4,
      title: "Flexible Booking",
      description: "Easily modify or cancel your booking without hassle.",
      icon: "🛏️",
    },
  ];

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // smooth scroll, optional
    });
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/categories`
        );
        if (Array.isArray(res.data)) setCategories(res.data);
        else if (res.data.category) setCategories([res.data.category]);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch offers
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/offers`
        );
        setOffers(res.data || []);
      } catch (err) {
        console.error("Error fetching offers:", err);
      } finally {
        setLoadingOffers(false);
      }
    };
    fetchOffers();
  }, []);

  useEffect(() => {
    let currentIndex = 0;

    const interval = setInterval(() => {
      const carousel = document.getElementById("offers-carousel");
      if (!carousel) return;

      currentIndex = (currentIndex + 1) % offers.length;
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }, 4000);

    return () => clearInterval(interval);
  }, [offers]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === offers.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [offers]);

  // Load featured properties from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("recentlyViewed");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setFeaturedProperties(parsed);
      }
    } catch (err) {
      console.error("Error parsing recentlyViewed:", err);
    }
  }, []);

  // Auto-scroll effect for offers
  useEffect(() => {
    const interval = setInterval(() => {
      const container = document.getElementById("offers-container");
      if (container) container.scrollBy({ left: 300, behavior: "smooth" });
    }, 4000);

    return () => clearInterval(interval);
  }, [offers]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Find Your Perfect Stay
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-slide-up text-white ">
            Discover amazing places around the world
          </p>
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary-hover text-lg px-8 py-4 animate-scale-in"
          >
            <Link to="/products">Start Exploring</Link>
          </Button>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Special Offers
          </h2>

          {loadingOffers ? (
            <p className="text-center text-muted-foreground">
              Loading offers...
            </p>
          ) : offers.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No offers available
            </p>
          ) : (
            <div className="relative w-full overflow-hidden">
              {/* Offers wrapper */}
              <div
                id="offers-carousel"
                className="flex transition-transform duration-700"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {offers.map((offer) => (
                  <div
                    key={offer._id}
                    className="w-full relative flex-shrink-0 h-[400px] md:h-[500px]"
                  >
                    <Link
                      key={offer._id}
                      to={`/offer/${offer._id}`}
                      className="group"
                    >
                      <img
                        src={
                          offer.image && offer.image.length > 0
                            ? `${offer.image[0]}`
                            : "https://placehold.co/1200x500"
                        }
                        alt={offer.category}
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center md:items-start p-8 md:p-16 text-white text-center md:text-left">
                        <Badge className="mb-4 bg-secondary text-secondary-foreground">
                          {offer.category}
                        </Badge>
                        <h3 className="text-3xl md:text-5xl font-bold mb-2">
                          {offer.name}
                        </h3>
                        <p className="text-lg md:text-xl">
                          {new Date(offer.startDate).toLocaleDateString()} –{" "}
                          {new Date(offer.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Arrows */}
              <button
                onClick={() =>
                  setCurrentIndex((prev) =>
                    prev === 0 ? offers.length - 1 : prev - 1
                  )
                }
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() =>
                  setCurrentIndex((prev) =>
                    prev === offers.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 text-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {offers.map((_, index) => (
                  <span
                    key={index}
                    className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
                      index === currentIndex ? "bg-white" : "bg-white/50"
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Browse by Category
          </h2>
          {loadingCategories ? (
            <p className="text-center text-muted-foreground">
              Loading categories...
            </p>
          ) : categories.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No categories available
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/products?category=${category.name}`}
                  className="group"
                >
                  <Card className="hover:shadow-brand-lg transition-all duration-300 group-hover:scale-105">
                    <CardContent className="p-0">
                      <img
                        src={category.image || "https://placehold.co/600x400"}
                        alt={category.name}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                      <div className="p-4 text-center">
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Explore now
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recently Viewed Properties Section */}
      {featuredProperties.length != 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">
                Recently Viewed Properties
              </h2>
              <Button variant="outline" asChild size="sm">
                <Link to="/products" className="flex items-center">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {featuredProperties.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No recently viewed properties available
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {featuredProperties.slice(0, 3).map((property) => (
                  <Card
                    key={property.id}
                    className="hover:shadow-brand-md transition-shadow group"
                    onClick={() => navigate(`/property/${property.id}`)}
                  >
                    <CardContent className="p-0">
                      <img
                        src={property.image}
                        alt={property.name}
                        className="w-full h-32 md:h-36 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-1">
                          {property.name}
                        </h3>
                        <div className="flex items-center text-muted-foreground text-sm mb-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          {property.city}
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-bold">
                            ₹{property.minPrice} - ₹{property.maxPrice}
                            <span className="text-xs text-muted-foreground">
                              /night
                            </span>
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Why Choose Us Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {whyChooseUs.map((item) => (
              <Card
                key={item.id}
                className="hover:shadow-brand-lg transition-transform duration-300 group"
              >
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 md:px-10 mb-8">
        <div className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-6">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Are you a property owner?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              List your property on our platform and reach more travelers
            </p>
          </div>

          <Link to="/list-property" className="w-full md:w-auto">
            <Button className="w-full md:w-auto">Add Your Property</Button>
          </Link>
        </div>
      </section>

      <SEO
        title="BookAnytime | Best Vacation Rentals"
        description="BookAnytime offers the best properties for rent in Hyderabad. Explore farmhouses, villas, and luxury stays for short or long term stays."
        keywords="Hyderabad vacation rentals, Hyderabad villas, Hyderabad farmhouses, BookAnytime, Best Vacation Rentals, Best Vacation Rentals in hyderabad"
        url={`${import.meta.env.VITE_URL}`}
      />
    </div>
  );
};

export default Index;
