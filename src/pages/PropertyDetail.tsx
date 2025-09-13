import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import {
  Star,
  MapPin,
  Heart,
  Share,
  CalendarIcon,
  Instagram,
} from "lucide-react";
import { format } from "date-fns";
import WishlistModal from "../components/WishlistModal";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const PropertyDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(2);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const [liked, setLiked] = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);

  const [ratings, setRatings] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);

  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // Fetch property & wishlist
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/properties/${id}`
        );
        setProperty(res.data);
        setSelectedImage(res.data.images?.[0] || "");

        // Recently Viewed
        if (res.data) {
          const recentlyViewed =
            JSON.parse(localStorage.getItem("recentlyViewed")) || [];
          const exists = recentlyViewed.some(
            (item: any) => item.id === res.data._id
          );
          if (!exists) {
            const newItem = {
              id: res.data._id,
              name: res.data.name,
              image: res.data.images?.[0],
              city: res.data.city,
              maxPrice: res.data.maxPrice,
              minPrice: res.data.minPrice,
              adults: res.data.adults,
              category: res.data.category,
            };
            localStorage.setItem(
              "recentlyViewed",
              JSON.stringify([newItem, ...recentlyViewed].slice(0, 10))
            );
          }
        }

        const wishlistRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/wishlist/${userId}`
        );
        const wishlists = Array.isArray(wishlistRes.data)
          ? wishlistRes.data
          : [];

        const alreadyLiked = wishlists.some((w: any) => {
          if (w.properties.includes(id)) return true;
          return false;
        });
        setLiked(alreadyLiked);
      } catch (err) {
        console.error("Failed to fetch property", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProperty();
  }, [id]);

  // Fetch Ratings
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/ratings/${id}`
        );
        setRatings(res.data);

        if (res.data.length > 0) {
          const avg =
            res.data.reduce((sum: number, r: any) => sum + r.rating, 0) /
            res.data.length;
          setAvgRating(avg);
        }
      } catch (err) {
        console.error("Failed to fetch ratings", err);
      }
    };

    if (id) fetchRatings();
  }, [id]);

  const removeFromWishlist = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/wishlist/${userId}/remove`,
        {
          headers: { "Content-Type": "application/json" },
          data: { propertyId: id },
        }
      );
      setLiked(false);
      toast({
        title: "Removed from wishlist",
        description: `${property.name} was removed from your wishlist.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Could not update wishlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleWishlistClick = () => {
    if (liked) removeFromWishlist();
    else setShowWishlistModal(true);
  };

  if (loading)
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading property details...</p>
      </div>
    );

  if (!property)
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Property Not Found</h1>
        <p className="text-muted-foreground">
          The property you're looking for doesn't exist.
        </p>
      </div>
    );

  const totalNights =
    checkIn && checkOut
      ? Math.ceil(
          (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;

  const totalPrice = totalNights * property.minPrice;

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      toast({
        title: "Please select dates",
        description: "Choose your check-in and check-out dates to continue.",
        variant: "destructive",
      });
      return;
    }

    const message = `Hello, I would like to book *${property.name}* (${
  property.category
}) in ${property.city}.
📍 Address: ${property.address}
📅 Check-in: ${format(checkIn, "MMM dd, yyyy")}
📅 Check-out: ${format(checkOut, "MMM dd, yyyy")}
👥 Guests: ${guests}
💰 Total Price: ₹${totalPrice + Math.round(totalPrice * 0.1)}`;

// Detect mobile (including React Native WebView)
const isMobile =
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  "ReactNativeWebView" in window || 
  navigator.userAgent.includes("wv"); 

// WhatsApp URL
const whatsappURL = isMobile
  ? `https://api.whatsapp.com/send?phone=${property.whatsappNumber}&text=${encodeURIComponent(message)}` // Mobile will open WhatsApp app if installed
  : `https://web.whatsapp.com/send?phone=${property.whatsappNumber}&text=${encodeURIComponent(message)}`; // Desktop/web

window.open(whatsappURL, "_blank");

  };

  const handleShare = async () => {
    const currentUrl = window.location.href;
    const shareText = `✨ Check out this amazing ${property.category} in ${property.city}!\n\n🏠 ${property.name}\n📍 ${property.address}\n\nClick here: ${currentUrl}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: property.name,
          text: shareText,
          url: currentUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Link copied",
          description: "Property details copied to clipboard.",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{property.popularity}</span>
              </div>
              {avgRating && (
                <div className="flex items-center space-x-1 ml-4">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{avgRating.toFixed(1)}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{property.city}</span>
              </div>
              {property.instagram && (
                <a
                  href={`https://instagram.com/${property.instagram}`}
                  
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-pink-600 hover:underline"
                >
                  <Instagram className="h-4 w-4" />
                  <span>@{property.instagram}</span>
                </a>
              )}
            </div>
          </div>

          <div className="flex space-x-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              variant={liked ? "default" : "outline"}
              size="sm"
              onClick={handleWishlistClick}
            >
              <Heart
                className={`h-4 w-4 mr-2 ${
                  liked ? "fill-red-500 text-red-500" : ""
                }`}
              />
              {liked ? "Saved" : "Save"}
            </Button>
          </div>
        </div>
        <Badge variant="secondary" className="capitalize">
          {property.category + " With "}
          👥 guests : {property.capacity.adults} | 🏨 sleeps: {property.capacity.bedrooms}
        </Badge>
      </div>

      {/* Image + Booking layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
        {/* Left side: main + thumbnails */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Main image */}
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full h-[400px] object-cover rounded-xl"
            />
          )}

          {/* Sub images / thumbnails */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {property.images?.map((img: string, i: number) => (
              <img
                key={i}
                src={img}
                alt={`${property.name}-${i}`}
                className={`w-full h-24 object-cover rounded-lg cursor-pointer border ${
                  selectedImage === img
                    ? "border-4 border-primary"
                    : "border border-gray-200"
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>

          {/* About, amenities, rules (full width under images) */}
          <div className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>About this place</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{property.description}</p>
               
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities?.map((amenity: string) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>House Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-muted-foreground">
                  {property.house_rules}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right side: SINGLE Booking Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold">
                    ₹{property.minPrice} - ₹{property.maxPrice}
                  </span>
                  <span className="text-muted-foreground"> /night</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Date Range Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal w-full"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkIn && checkOut
                      ? `${format(checkIn, "MMM dd")} - ${format(
                          checkOut,
                          "MMM dd"
                        )}`
                      : "Select dates"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{ from: checkIn, to: checkOut }}
                    onSelect={(range: any) => {
                      setCheckIn(range?.from);
                      setCheckOut(range?.to);
                    }}
                    numberOfMonths={2}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Guests counter */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Guests</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{guests}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGuests(guests + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Price breakdown */}
              {totalNights > 0 && (
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between">
                    <span>
                      ₹{property.minPrice} × {totalNights} nights
                    </span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>₹{Math.round(totalPrice * 0.1)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total</span>
                    <span>₹{totalPrice + Math.round(totalPrice * 0.1)}</span>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <Button
                onClick={handleBooking}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Book on WhatsApp
              </Button>
              <Button
                onClick={() => window.open(`tel:${property.call}`, "_self")}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Call Us
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Google Map */}
      {isLoaded && property.latitude && property.longitude && (
        <div className="w-full h-96 mt-8 rounded-lg overflow-hidden">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={{
              lat: parseFloat(property.latitude),
              lng: parseFloat(property.longitude),
            }}
            zoom={15}
          >
            <Marker
              position={{
                lat: parseFloat(property.latitude),
                lng: parseFloat(property.longitude),
              }}
            />
          </GoogleMap>
        </div>
      )}

      {/* Ratings */}
      {ratings.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-bold">Guest Reviews</h2>
          {ratings.map((r) => (
            <Card key={r._id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{r.username}</span>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < r.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {r.month} {r.year}
                </span>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{r.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Wishlist Modal */}
      <WishlistModal
        show={showWishlistModal}
        onClose={() => setShowWishlistModal(false)}
        userId={userId}
        propertyId={id}
        onWishlistUpdate={() => setLiked(true)}
      />
    </div>
  );
};

export default PropertyDetail;
