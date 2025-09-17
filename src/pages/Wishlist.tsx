// import { useState, useEffect } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import { Button } from "@/components/ui/button";
// import { Heart, ChevronDown, ChevronRight, Trash } from "lucide-react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import PropertyCard from "@/components/PropertyCard";
// import PropertyCard2 from "@/components/Propertycard2";

// const Wishlist = () => {
//   const { isAuthenticated } = useAuth();
//   const [wishlists, setWishlists] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [expanded, setExpanded] = useState<Record<string, boolean>>({});

//   const userId = JSON.parse(localStorage.getItem("user"))?.id; // userId saved on login

//   // DELETE whole wishlist
//   const handleDeleteWishlist = async (wishlistId: string) => {
//     try {
//       await axios.delete(
//         `${import.meta.env.VITE_API_URL}/api/wishlist/${wishlistId}`,
//         {
//           data: { userId },
//         }
//       );

//       // Remove deleted wishlist from UI
//       setWishlists((prev) => prev.filter((wl) => wl._id !== wishlistId));
//     } catch (err) {
//       console.error("Failed to delete wishlist", err);
//       alert("Failed to delete wishlist. Please try again.");
//     }
//   };

//   // Fetch all wishlists
//   const fetchWishlists = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_API_URL}/api/wishlist/${userId}`
//       );
//       const rawWishlists = Array.isArray(res.data) ? res.data : [];

//       const updatedWishlists = await Promise.all(
//         rawWishlists.map(async (wl) => {
//           const properties = await Promise.all(
//             wl.properties.map(async (propertyId: string) => {
//               try {
//                 const resp = await axios.get(
//                   `${import.meta.env.VITE_API_URL}/api/properties/${propertyId}`
//                 );
//                 return resp.data;
//               } catch (err) {
//                 console.error("Error fetching property", err);
//                 return null;
//               }
//             })
//           );
//           return { ...wl, properties: properties.filter(Boolean) };
//         })
//       );

//       let wishlistedIds: string[] = [];
//       if (userId) {
//         try {
//           const wishlistRes = await axios.get(
//             `${import.meta.env.VITE_API_URL}/api/wishlist/${userId}`
//           );
//           const rawWishlists = Array.isArray(wishlistRes.data)
//             ? wishlistRes.data
//             : [];
//           wishlistedIds = rawWishlists.flatMap((wl: any) => wl.properties);
//         } catch (err) {
//           console.error("Failed to fetch wishlist", err);
//         }
//       }

//       const finalProps = updatedWishlists.map((wishlist) => ({
//         ...wishlist,
//         properties: wishlist.properties.map((property) => ({
//           ...property,
//           isWishlisted: wishlistedIds.includes(property._id),
//           wishlistName: wishlist.name,
//         })),
//       }));

//       setWishlists(finalProps);

//       // default expand all wishlists
//       const initialExpanded: Record<string, boolean> = {};
//       finalProps.forEach((wl) => {
//         initialExpanded[wl._id] = true;
//       });
//       setExpanded(initialExpanded);
//     } catch (err) {
//       console.error("Failed to fetch wishlists", err);
//       setWishlists([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (userId) {
//       fetchWishlists();
//     } else {
//       setLoading(false);
//     }
//   }, [isAuthenticated, userId]);

//   if (!isAuthenticated || !userId) {
//     return (
//       <div className="container mx-auto px-4 py-16">
//         <div className="text-center">
//           <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
//           <h1 className="text-3xl font-bold text-foreground mb-4">
//             Your Wishlist
//           </h1>
//           <p className="text-lg text-muted-foreground mb-8">
//             Please log in to view your saved properties.
//           </p>
//           <Link to="/login">
//             <Button>Login Now</Button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-16 text-center">
//         <p>Loading your wishlists...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-foreground mb-2">
//           Your Wishlists
//         </h1>
//         <p className="text-muted-foreground">
//           {wishlists.reduce((sum, wl) => sum + wl.properties.length, 0)} saved
//           properties
//         </p>
//       </div>

//       {wishlists.length > 0 ? (
//         wishlists.map((wl) => (
//           <div
//             key={wl._id}
//             className="mb-6 border rounded-lg shadow-sm overflow-hidden"
//           >
//             {/* Wishlist Header */}
//             <div className="flex justify-between items-center bg-white px-4 py-3 hover:bg-gray-50 transition">
//               <Button
//                 variant="ghost"
//                 className="flex-1 flex justify-between items-center px-0 py-0 text-left"
//                 onClick={() =>
//                   setExpanded((prev) => ({ ...prev, [wl._id]: !prev[wl._id] }))
//                 }
//               >
//                 <span className="text-lg font-semibold text-black">
//                   {wl.name} ({wl.properties.length})
//                 </span>
//                 {expanded[wl._id] ? (
//                   <ChevronDown className="h-5 w-5 text-black" />
//                 ) : (
//                   <ChevronRight className="h-5 w-5 text-black" />
//                 )}
//               </Button>

//               {/* Delete Wishlist Icon */}
//               {wl.name != "Favourites" && (
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="text-red-500 hover:text-red-700"
//                   onClick={() => {
//                     if (
//                       confirm("Are you sure you want to delete this wishlist?")
//                     ) {
//                       handleDeleteWishlist(wl._id);
//                     }
//                   }}
//                 >
//                   <Trash className="h-5 w-5" />
//                 </Button>
//               )}
//             </div>

//             {/* Wishlist Properties */}
//             {expanded[wl._id] && (
//               <div className="p-4 bg-gray-50">
//                 {wl.properties.length > 0 ? (
//                   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                     {wl.properties.map((property: any) => (
//                       <div key={property._id} className="relative group">
//                         <PropertyCard2 property={property} />
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-muted-foreground text-center">
//                     No properties in this wishlist yet.
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>
//         ))
//       ) : (
//         <div className="text-center py-16">
//           <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
//           <h2 className="text-2xl font-semibold text-foreground mb-4">
//             You don’t have any wishlists yet
//           </h2>
//           <p className="text-muted-foreground mb-8">
//             Start exploring and save properties you love!
//           </p>
//           <Button asChild>
//             <Link to="/products">Browse Properties</Link>
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Wishlist;

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Heart, ChevronDown, ChevronRight, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import PropertyCard2 from "@/components/PropertyCard2";

const Wishlist = () => {
  const { isAuthenticated } = useAuth();
  const [wishlists, setWishlists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  const handleDeleteWishlist = async (wishlistId: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/wishlist/${wishlistId}`, { data: { userId } });
      setWishlists((prev) => prev.filter((wl) => wl._id !== wishlistId));
    } catch (err) {
      console.error("Failed to delete wishlist", err);
      alert("Failed to delete wishlist. Please try again.");
    }
  };

  const fetchWishlists = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/wishlist/${userId}`);
      const rawWishlists = Array.isArray(res.data) ? res.data : [];

      const updatedWishlists = await Promise.all(
        rawWishlists.map(async (wl) => {
          const properties = await Promise.all(
            wl.properties.map(async (propertyId: string) => {
              try {
                const resp = await axios.get(`${import.meta.env.VITE_API_URL}/api/properties/${propertyId}`);
                return resp.data;
              } catch {
                return null;
              }
            })
          );
          return { ...wl, properties: properties.filter(Boolean) };
        })
      );

      // Build list of wishlisted property IDs
      const wishlistedIds = rawWishlists.flatMap((wl: any) => wl.properties);

      const finalProps = updatedWishlists.map((wl) => ({
        ...wl,
        properties: wl.properties.map((property) => ({
          ...property,
          isWishlisted: wishlistedIds.includes(property._id),
          wishlistName: wl.name,
        })),
      }));

      setWishlists(finalProps);

      const initialExpanded: Record<string, boolean> = {};
      finalProps.forEach((wl) => { initialExpanded[wl._id] = true; });
      setExpanded(initialExpanded);
    } catch (err) {
      console.error("Failed to fetch wishlists", err);
      setWishlists([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchWishlists();
    else setLoading(false);
  }, [isAuthenticated, userId]);

  if (!isAuthenticated || !userId) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">Your Wishlist</h1>
        <p className="text-lg text-muted-foreground mb-8">Please log in to view your saved properties.</p>
        <Link to="/login"><Button>Login Now</Button></Link>
      </div>
    );
  }

  if (loading) return <div className="container mx-auto px-4 py-16 text-center"><p>Loading your wishlists...</p></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Wishlists</h1>
        <p className="text-muted-foreground">{wishlists.reduce((sum, wl) => sum + wl.properties.length, 0)} saved properties</p>
      </div>

      {wishlists.length > 0 ? (
        wishlists.map((wl) => (
          <div key={wl._id} className="mb-6 border rounded-lg shadow-sm overflow-hidden">
            {/* Wishlist Header */}
            <div className="flex justify-between items-center bg-white px-4 py-3 hover:bg-gray-50 transition">
              <Button
                variant="ghost"
                className="flex-1 flex justify-between items-center px-0 py-0 text-left"
                onClick={() => setExpanded((prev) => ({ ...prev, [wl._id]: !prev[wl._id] }))}
              >
                <span className="text-lg font-semibold text-black">{wl.name} ({wl.properties.length})</span>
                {expanded[wl._id] ? <ChevronDown className="h-5 w-5 text-black"/> : <ChevronRight className="h-5 w-5 text-black"/>}
              </Button>

              {wl.name !== "Favourites" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this wishlist?")) handleDeleteWishlist(wl._id);
                  }}
                >
                  <Trash className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Wishlist Properties */}
            {expanded[wl._id] && (
              <div className="p-4 bg-gray-50">
                {wl.properties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {wl.properties.map((property: any) => (
                      <PropertyCard2
                        key={property._id}
                        property={property}
                        onRemoveFromWishlist={(propertyId: string) => {
                          setWishlists((prev) =>
                            prev.map((w) =>
                              w._id === wl._id
                                ? { ...w, properties: w.properties.filter((p: any) => p._id !== propertyId) }
                                : w
                            )
                          );
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center">No properties in this wishlist yet.</p>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">You don’t have any wishlists yet</h2>
          <p className="text-muted-foreground mb-8">Start exploring and save properties you love!</p>
          <Button asChild><Link to="/products">Browse Properties</Link></Button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
