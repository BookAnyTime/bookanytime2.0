
import React, { useState, useEffect } from "react";
import axios from "axios";

const DeleteOfferModal = ({ show, handleClose }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const fetchOffers = (category) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/offers/category/${category}`)
      .then((res) => setOffers(res.data))
      .catch((err) => console.error("Error fetching offers:", err));
  };

  const handleDelete = async () => {
    if (!selectedOffer) {
      alert("Please select an offer to delete.");
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/offers/delete/${selectedOffer}`);
      alert("Offer deleted successfully!");
      handleClose();
    } catch (error) {
      console.error("Error deleting offer:", error);
      alert("Failed to delete offer.");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-lg relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
          onClick={handleClose}
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Delete Offer</h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Category</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                fetchOffers(e.target.value);
              }}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Available Offers</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={selectedOffer}
              onChange={(e) => setSelectedOffer(e.target.value)}
            >
              <option value="">Select Offer</option>
              {offers.map((offer) => (
                <option key={offer._id} value={offer._id}>
                  {offer.category} - {new Date(offer.startDate).toDateString()}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete Offer
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteOfferModal;
