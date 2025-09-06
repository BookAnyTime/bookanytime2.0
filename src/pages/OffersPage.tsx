import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";

interface Offer {
  _id: string;
  name: string;
  category: string;
  properties: { _id: string; name: string }[];
  image: string[];
  startDate: string;
  endDate: string;
}

interface Property {
  _id: string;
  name: string;
  category: string;
  description: string;
  city: string;
  address: string;
  minPrice: number;
  maxPrice: number;
  popularity: number;
  images: string[];
  amenities: string[];
  rating?: number;
  isWishlisted?: boolean;
  wishlistName: string; // ✅ always required
}

const OffersPage = () => {
  const { id } = useParams(); // Offer ID from URL
  const [offer, setOffer] = useState<Offer | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = JSON.parse(localStorage.getItem("user") || "{}")?.id;

  useEffect(() => {
    const fetchOfferAndProperties = async () => {
      try {
        setLoading(true);

        // 1️⃣ Get offer details
        const offerRes = await axios.get<Offer>(
          `${import.meta.env.VITE_API_URL}/api/offers/${id}`
        );
        setOffer(offerRes.data);

        // 2️⃣ Fetch wishlist for current user
        let wishlistIds: string[] = [];
        let wishlistMap: Record<string, string> = {}; // propertyId -> wishlistName
        if (userId) {
          const wishlistRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/wishlist/${userId}`
          );
          const wishlistData = wishlistRes.data;
          wishlistData.forEach((list: any) => {
            list.properties.forEach((pid: string) => {
              wishlistIds.push(pid);
              wishlistMap[pid] = list.name;
            });
          });
        }

        // 3️⃣ Fetch all property details inside the offer
        const propertyPromises = offerRes.data.properties.map((p) =>
          axios.get<Property>(
            `${import.meta.env.VITE_API_URL}/api/properties/${p._id}`
          )
        );

        const propertyResults = await Promise.all(propertyPromises);

        const enrichedProperties = propertyResults.map((res) => {
          const prop = res.data;
          return {
            ...prop,
            isWishlisted: wishlistIds.includes(prop._id),
            wishlistName: wishlistMap[prop._id] || "", // ✅ always a string
          };
        });

        setProperties(enrichedProperties);
      } catch (err) {
        console.error("Error fetching offer details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOfferAndProperties();
  }, [id, userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!offer) {
    return <div className="p-6">Offer not found</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Offer Header */}
      <Card className="overflow-hidden">
        <img
          src={offer.image[0] || "/placeholder.jpg"}
          alt={offer.name}
         className="w-full h-80 object-fill"
        />
        <CardContent className="p-4 space-y-2">
          <h2 className="text-2xl font-bold">{offer.name}</h2>
          <Badge variant="secondary" className="capitalize">
            {offer.category}
          </Badge>
          <p className="text-sm text-muted-foreground">
            {new Date(offer.startDate).toLocaleDateString()} -{" "}
            {new Date(offer.endDate).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      {/* Properties under this offer */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property._id} property={property} />
        ))}
      </div>
    </div>
  );
};

export default OffersPage;
