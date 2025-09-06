import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import heartImage from "../assets/heartImage.jpg";
import { useToast } from "@/hooks/use-toast";

interface Wishlist {
  _id: string;
  name: string;
  properties: string[];
  lastPropertyImage?: string | null;
}

interface WishlistModalProps {
  show: boolean;
  onClose: () => void;
  userId: string | null;
  propertyId: string;
  onWishlistUpdate: () => void;
}

const WishlistModal: React.FC<WishlistModalProps> = ({
  show,
  onClose,
  userId,
  propertyId,
  onWishlistUpdate,
}) => {
  const [userWishlists, setUserWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [wishlistName, setWishlistName] = useState("");

  const navigate = useNavigate();

  userId =  JSON.parse(localStorage.getItem("user"))?.id;
    const { toast } = useToast();


  useEffect(() => {
    if (show) {
      if (!userId) {
        onClose();
        // navigate("/login");
        window.open("/login", "_blank")
      } else {
        fetchWishlists();
      }
    }
  }, [show, userId, navigate]);

  const fetchWishlists = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Wishlist[]>(
        `${import.meta.env.VITE_API_URL}/api/wishlist/${userId}`
      );
      const wishlists = Array.isArray(response.data) ? response.data : [];

      const updatedWishlists = await Promise.all(
        wishlists.map(async (wishlist) => {
          if (wishlist.properties.length > 0) {
            const lastPropertyId =
              wishlist.properties[wishlist.properties.length - 1];
            try {
              const propertyResponse = await axios.get<{
                images: string[];
              }>(`${import.meta.env.VITE_API_URL}/api/properties/${lastPropertyId}`);
              return {
                ...wishlist,
                lastPropertyImage: propertyResponse.data.images[0],
              };
            } catch {
              return { ...wishlist, lastPropertyImage: null };
            }
          }
          return { ...wishlist, lastPropertyImage: null };
        })
      );

      setUserWishlists(updatedWishlists);
    } catch {
      setError("Failed to load wishlists. Please try again.");
      setUserWishlists([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToWishlist = async (selectedWishlist: string) => {
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/wishlist/add`, {
        userId,
        propertyId,
        wishlistName: selectedWishlist,
      });

      await fetchWishlists();
      onWishlistUpdate();
      toast({
        title: "added to wishlist",
        description: `goto ${selectedWishlist} wishlist to view product.`,
      });
      onClose();


    } catch {
      setError("Failed to add to wishlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWishlist = async () => {
    if (!wishlistName.trim()) return;
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/wishlist/create`, {
        userId,
        wishlistName,
      });

      await fetchWishlists();
      handleSaveToWishlist(wishlistName);
      setShowCreateModal(false);
      setWishlistName("");
    } catch (error: any) {
      if (error.response?.data?.error?.includes("already exists")) {
        setError("Wishlist name already exists. Please choose a different name.");
      } else {
        setError("Failed to create wishlist. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      {/* Main Wishlist Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Save to Wishlist</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="p-4">
            {error && (
              <div className="mb-3 text-red-600 text-sm font-medium">{error}</div>
            )}

            {loading ? (
              <div className="flex flex-col items-center py-6">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2 text-gray-600">Loading wishlists...</p>
              </div>
            ) : userWishlists.length > 0 ? (
              <>
                <h5 className="text-sm font-medium mb-3">Select a Wishlist</h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-72 overflow-y-auto pr-1">
                  {userWishlists.map((wishlist) => (
                    <div
                      key={wishlist._id}
                      onClick={() => handleSaveToWishlist(wishlist.name)}
                      className="cursor-pointer text-center"
                    >
                      <img
                        src={wishlist.lastPropertyImage || heartImage}
                        alt={wishlist.name}
                        className="w-full h-28 object-cover rounded-lg"
                      />
                      <p className="mt-2 text-sm font-semibold text-gray-800">
                        {wishlist.name}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-600">No wishlists found.</p>
            )}

            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full mt-4 px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
            >
              + Create New Wishlist
            </button>
          </div>

          <div className="flex justify-end gap-2 p-4 border-t">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Create Wishlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Create New Wishlist</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              <label className="block text-sm font-medium mb-1">
                Wishlist Name
              </label>
              <input
                type="text"
                placeholder="Enter wishlist name"
                value={wishlistName}
                onChange={(e) => setWishlistName(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                onClick={() => setShowCreateModal(false)}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWishlist}
                disabled={!wishlistName.trim() || loading}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                {loading ? "Creating..." : "Create & Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WishlistModal;
