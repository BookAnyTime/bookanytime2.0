import React, { useState, useEffect } from "react";
import axios from "axios";

const AddOfferModal = ({ show, handleClose }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [image, setImage] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [properties, setProperties] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [selectedname, setSelectedname] = useState("");
  const [selectednames, setSelectednames] = useState(["EarlyBird","flash sales", "limited-time offers", "pre-order specials", "seasonal sales", "loyalty discounts"]);

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

  const handleImageChange = (e) => {
    setImage([...e.target.files]);
  };

  const handlePropertySelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedProps = selectedOptions.map((option) => ({
      _id: option.value,
      name: option.text,
    }));
    setSelectedProperties(selectedProps);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("category", selectedCategory);
    formData.append("properties", JSON.stringify(selectedProperties));
    image.forEach((img) => formData.append("images", img));
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("name", selectedname);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/offers/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Offer added successfully!");
      handleClose();
    } catch (error) {
      console.error("Error adding offer:", error);
      alert("Failed to add offer.");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-lg relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
          onClick={handleClose}
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Add New Offer</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

        <div>
            <label className="block mb-1 font-semibold">name</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedname}
              onChange={(e) => setSelectedname(e.target.value)}
            >
              <option value="">Select sale</option>
              {selectednames.map((cat) => (
                <option value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>


          <div>
            <label className="block mb-1 font-semibold">Category</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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
            <label className="block mb-1 font-semibold">Properties</label>
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

          <div>
            <label className="block mb-1 font-semibold">Offer Image</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Offer
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOfferModal;
