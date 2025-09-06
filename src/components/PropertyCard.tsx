
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Heart } from "lucide-react";
import WishlistModal from "@/components/WishlistModal";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";


interface PropertyCardProps {
  property: {
    _id: string;
    name: string;
    category: string;
    city: string;
    address: string;
    minPrice: number;
    maxPrice: number;
    popularity: number;
    images: string[];
    amenities: string[];
    rating?: number;
    isWishlisted?: boolean; // ✅ added
    wishlistName:string
  };
  showRemoveFromWishlist?: boolean;
  onWishlistUpdate?: () => void;
}

const PropertyCard = ({
  property,
}: PropertyCardProps) => {
  const { user } = useAuth();
  const [wishlistModalOpen, setWishlistModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(property.isWishlisted ?? false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const userId =  JSON.parse(localStorage.getItem("user"))?.id;

  // ✅ Sync when parent updates property.isWishlisted
  useEffect(() => {
    console.log(property)
    setIsWishlisted(property.isWishlisted ?? false);
  }, [property.isWishlisted]);



    const handleRemove = () => {
    if (isWishlisted) {
      handleunlike();
    } else {
      setWishlistModalOpen(true);
    }
  };

  // Handle remove from wishlist
  const handleunlike = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      // await axios.post(`${import.meta.env.VITE_API_URL}/api/wishlist/${userId}/remove`, {
      //   propertyId: property._id,
      // });

      await axios.delete(`${import.meta.env.VITE_API_URL}/api/wishlist/${userId}/remove`, {
        headers: { "Content-Type": "application/json" },
        data: { propertyId : property._id, wishlistName : property.wishlistName },
      });
      setIsWishlisted(false);
      toast({
        title: "Removed from wishlist",
        description: `${property.name} was removed from your wishlist.`,
      });
      
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-brand-lg transition-all duration-300 group" >
        <div className="relative">
          <img
            src={property.images?.[0] || "/placeholder.jpg"}
            alt={property.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onClick={()=>
              // navigate(`/property/${property._id}`)
              window.open(`/property/${property._id}`, "_blank")
            }
          />
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="capitalize">
              {property.category}
            </Badge>
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            disabled={loading}
            onClick={() => {
              handleRemove()
            }}
            className="absolute top-3 right-3 bg-background/80 hover:bg-background"
          >
            <Heart
              className={`h-4 w-4 ${
                isWishlisted ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>
        </div>

        <CardContent className="p-4" onClick={()=>
          // navigate(`/property/${property._id}`)
          window.open(`/property/${property._id}`, "_blank")
          }>
          <div className="space-y-2">
            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium ml-1">
                  {property.rating ?? 0}
                </span>
              </div>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-lg text-foreground line-clamp-2">
              {property.name}
            </h3>

            {/* Location */}
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">
                {property.city}, {property.address}
              </span>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-1">
              {property.amenities?.slice(0, 3).map((amenity) => (
                <Badge key={amenity} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
            </div>

            {/* Price & CTA */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-right">
                <span className="text-xl font-bold">
                  ₹{property.minPrice.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground"> /night</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wishlist Modal */}
      {wishlistModalOpen && (
        <WishlistModal
          show={wishlistModalOpen}
          onClose={() => setWishlistModalOpen(false)}
          userId={userId!}
          propertyId={property._id}
          onWishlistUpdate={() => {
            setIsWishlisted(true);
          }}
        />
      )}
    </>
  );
};

export default PropertyCard;
