
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import PropertyCard from "@/components/PropertyCard";

const Wishlist = () => {
  const { isAuthenticated } = useAuth();
  const [wishlists, setWishlists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
          wishlistName: wishlist.name
        })),
      }));

      console.log("updatedWishlists:", updatedWishlists);
      console.log("finalProps:", finalProps);

      setWishlists(finalProps);
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

  if (!isAuthenticated) {
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
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
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
          <div key={wl._id} className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">{wl.name}</h2>
            {wl.properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {wl.properties.map((property: any) => (
                  <PropertyCard
                    key={property._id}
                    property={property}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No properties in this wishlist yet.
              </p>
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
            <Link to="/products">Browse Properties</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
