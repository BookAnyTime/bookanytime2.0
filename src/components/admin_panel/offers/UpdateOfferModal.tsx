import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateOfferModal = ({ show, handleClose }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [properties, setProperties] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetch(
        `${import.meta.env.VITE_API_URL}/api/properties?category=${encodeURIComponent(
          selectedCategory
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setProperties(data);
          else setProperties([]);
        })
        .catch((error) => console.error("Error fetching properties:", error));
    } else {
      setProperties([]);
    }
  }, [selectedCategory]);

  const fetchOffers = (category) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/offers/category/${category}`)
      .then((res) => setOffers(res.data))
      .catch((err) => console.error("Error fetching offers:", err));
  };

  const fetchOfferDetails = (offerId) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/offers/${offerId}`)
      .then((res) => {
        const data = res.data;
        setStartDate(data.startDate.split("T")[0]);
        setEndDate(data.endDate.split("T")[0]);
        setExistingImages(data.image || []);
      })
      .catch((err) => console.error("Error fetching offer details:", err));
  };

  const handlePropertySelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedProps = selectedOptions.map((option) => ({
      _id: option.value,
      name: option.text,
    }));
    setSelectedProperties(selectedProps);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedOffer) {
      alert("Please select an offer to update.");
      return;
    }

    const formData = new FormData();
    formData.append("properties", JSON.stringify(selectedProperties));
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    if (removeImages.length > 0) {
      formData.append("removeImages", JSON.stringify(removeImages));
    }
    newImages.forEach((img) => formData.append("images", img));

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/offers/update/${selectedOffer}`,
        formData
      );
      alert("Offer updated successfully!");
      setSelectedCategory("");
      setSelectedOffer("");
      setSelectedProperties([]);
      setNewImages([]);
      setExistingImages([]);
      setRemoveImages([]);
      setStartDate("");
      setEndDate("");
      handleClose();
    } catch (error) {
      console.error("Error updating offer:", error);
      alert("Failed to update offer.");
    }
  };

  const handleRemoveImage = (img) => {
    setRemoveImages([...removeImages, img]);
    setExistingImages(existingImages.filter((image) => image !== img));
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-lg relative overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
          onClick={handleClose}
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Update Offer</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Category & Properties */}
          <div className="space-y-2">
            <label className="block font-semibold">Category</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            <label className="block font-semibold">Select Properties</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              multiple
              onChange={handlePropertySelection}
            >
              {properties.map((prop) => (
                <option key={prop._id} value={prop._id}>
                  {prop.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Offer */}
          <div className="space-y-2">
            <label className="block font-semibold">Select Offer</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedOffer}
              onChange={(e) => {
                setSelectedOffer(e.target.value);
                fetchOfferDetails(e.target.value);
              }}
            >
              <option value="">Select Offer</option>
              {offers.map((offer) => (
                <option key={offer._id} value={offer._id}>
                  {offer.category} - {new Date(offer.startDate).toDateString()}
                </option>
              ))}
            </select>
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <p className="font-semibold mb-2">Existing Images:</p>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((img, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <img
                      src={`${import.meta.env.VITE_API_URL}${img}`}
                      alt="Offer"
                      className="w-24 h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                      onClick={() => handleRemoveImage(img)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload New Images */}
          <div>
            <label className="block font-semibold mb-1">Upload More Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setNewImages([...newImages, ...Array.from(e.target.files)])
              }
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Start & End Dates */}
          <div className="space-y-2">
            <label className="block font-semibold">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-semibold">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Update Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateOfferModal;
