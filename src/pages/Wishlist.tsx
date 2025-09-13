import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Heart, ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import PropertyCard from "@/components/PropertyCard";

const Wishlist = () => {
  const { isAuthenticated } = useAuth();
  const [wishlists, setWishlists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const userId = JSON.parse(localStorage.getItem("user"))?.id; // userId saved on login

  useEffect(() => {
    if (userId) {
      fetchWishlists();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, userId]);

  const fetchWishlists = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/wishlist/${userId}`
      );

      const rawWishlists = Array.isArray(res.data) ? res.data : [];

      // fetch property details for each wishlist
      const updatedWishlists = await Promise.all(
        rawWishlists.map(async (wl) => {
          const properties = await Promise.all(
            wl.properties.map(async (propertyId: string) => {
              try {
                const resp = await axios.get(
                  `${import.meta.env.VITE_API_URL}/api/properties/${propertyId}`
                );
                return resp.data;
              } catch (err) {
                console.error("Error fetching property", err);
                return null;
              }
            })
          );
          return { ...wl, properties: properties.filter(Boolean) };
        })
      );

      let wishlistedIds: string[] = [];
      if (userId) {
        try {
          const wishlistRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/wishlist/${userId}`
          );
          const rawWishlists = Array.isArray(wishlistRes.data)
            ? wishlistRes.data
            : [];
          wishlistedIds = rawWishlists.flatMap((wl: any) => wl.properties);
        } catch (err) {
          console.error("Failed to fetch wishlist", err);
        }
      }

      const finalProps = updatedWishlists.map((wishlist) => ({
        ...wishlist,
        properties: wishlist.properties.map((property) => ({
          ...property,
          isWishlisted: wishlistedIds.includes(property._id),
          wishlistName: wishlist.name,
        })),
      }));

      setWishlists(finalProps);

      // default expand all wishlists
      const initialExpanded: Record<string, boolean> = {};
      finalProps.forEach((wl) => {
        initialExpanded[wl._id] = true;
      });
      setExpanded(initialExpanded);
    } catch (err) {
      console.error("Failed to fetch wishlists", err);
      setWishlists([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Unlike (remove property from wishlist)
  const handleRemoveFromWishlist = async (
    wishlistId: string,
    propertyId: string
  ) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/wishlist/remove`, {
        userId,
        propertyId,
      });

      // Optimistically update UI
      setWishlists((prev) =>
        prev.map((wl) =>
          wl._id === wishlistId
            ? {
                ...wl,
                properties: wl.properties.filter(
                  (p: any) => p._id !== propertyId
                ),
              }
            : wl
        )
      );
    } catch (err) {
      console.error("Failed to remove from wishlist", err);
    }
  };

  // Show "Login Now" if user is not logged in
  if (!isAuthenticated || !userId) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Your Wishlist
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Please log in to view your saved properties.
          </p>
          {/* Static button, no redirect */}
          <Link to="/login" >
          <Button>
            Login Now
          </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading your wishlists...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Your Wishlists
        </h1>
        <p className="text-muted-foreground">
          {wishlists.reduce((sum, wl) => sum + wl.properties.length, 0)} saved
          properties
        </p>
      </div>

      {wishlists.length > 0 ? (
        wishlists.map((wl) => (
          <div key={wl._id} className="mb-10 border rounded-lg shadow-sm">
            <Button
              className="flex justify-between items-center w-full px-4 py-3 transition rounded-t-lg"
              onClick={() =>
                setExpanded((prev) => ({
                  ...prev,
                  [wl._id]: !prev[wl._id],
                }))
              }
            >
              <span className="text-xl font-semibold">
                {wl.name} ({wl.properties.length})
              </span>
              {expanded[wl._id] ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </Button>

            {expanded[wl._id] && (
              <div className="p-4">
                {wl.properties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {wl.properties.map((property: any) => (
                      <div key={property._id} className="relative group">
                        <PropertyCard property={property} />

                        {/* Show "Login Now" button overlay on hover */}
                        {!isAuthenticated && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <Button disabled className="cursor-not-allowed">
                              Login Now
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No properties in this wishlist yet.
                  </p>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            You don’t have any wishlists yet
          </h2>
          <p className="text-muted-foreground mb-8">
            Start exploring and save properties you love!
          </p>
          <Button asChild>
            <Link to="/products" >Browse Properties</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
