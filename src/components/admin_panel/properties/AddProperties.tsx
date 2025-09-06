
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminPropertyForm = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    house_rules: "",
    minPrice: "",
    maxPrice: "",
    city: "",
    address: "",
    latitude: "",
    longitude: "",
    amenities: [],
    adults: "",
    bedrooms: "",
    popularity: "",
    images: [],
    whatsappNumber: "",
    instagram: "",
    call:""
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newAmenity, setNewAmenity] = useState("");
  const [selectedAmenity, setSelectedAmenity] = useState("");
  const [loading, setLoading] = useState(false);

  const amenitiesOptions = [
    "WiFi","Swimming Pool","Kitchen","Air conditioning","Heating","Free washing machine","Dryer",
    "HDTV with Netflix","Iron","Hair dryer","Dedicated workspace","Hot tub","Free parking on premises",
    "Paid parking","Gym","BBQ grill","Box cricket","Barbeque setup","Projector","Jacuzzi","Camp fire",
    "Smoking allowed","Pets allowed","Breakfast included","Security cameras","Fire extinguisher",
    "First aid kit","Hot water","Private back garden – Fully fenced","Window AC unit","Patio or balcony",
    "Bath tubs","Lawn","Outdoor barbeque","Other"
  ];

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "category") setSelectedCategory(value);
  };

  const handleImageChange = (e) => {
    setImageFiles([...e.target.files]);
  };

  const handleAmenitySelect = (e) => {
    const value = e.target.value;
    setSelectedAmenity(value);
    if (value !== "Other" && !formData.amenities.includes(value)) {
      setFormData((prev) => ({ ...prev, amenities: [...prev.amenities, value] }));
    }
  };

  const handleAddNewAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity)) {
      setFormData((prev) => ({ ...prev, amenities: [...prev.amenities, newAmenity] }));
      setNewAmenity("");
    }
  };

  const handleRemoveAmenity = (amenityToRemove) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((amenity) => amenity !== amenityToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formDataToSend = new FormData();
    imageFiles.forEach((file) => formDataToSend.append("images", file));
    Object.keys(formData).forEach((key) => {
      if (key !== "images") formDataToSend.append(key, formData[key]);
    });
    formDataToSend.delete("adults");
    formDataToSend.delete("bedrooms");
    formDataToSend.append("adults", String(Number(formData.adults) || 0));
    formDataToSend.append("bedrooms", String(Number(formData.bedrooms) || 0));

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/properties`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Property added successfully!");
      resetForm();
    } catch (error) {
      console.error("Error adding property:", error);
      alert("Failed to add property.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      house_rules: "",
      minPrice: "",
      maxPrice: "",
      city: "",
      address: "",
      latitude: "",
      longitude: "",
      amenities: [],
      adults: "",
      bedrooms: "",
      popularity: "",
      images: [],
      whatsappNumber: "",
      instagram: "",
      call:""
    });
    setImageFiles([]);
    setSelectedAmenity("");
    setSelectedCategory("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <h2 className="text-2xl font-bold text-center mb-6">Add New Property</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Property Name & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Property Name"
            required
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          <select
            name="category"
            value={selectedCategory}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-3 py-2 w-full"
          >
            <option value="">Select Category</option>
            {categories.map((option) => (
              <option key={option._id} value={option.name}>{option.name}</option>
            ))}
          </select>
        </div>

        {/* Description & House Rules */}
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Description"
          required
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        <textarea
          name="house_rules"
          value={formData.house_rules}
          onChange={handleChange}
          rows={3}
          placeholder="House Rules"
          required
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />

        {/* Price Range */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <input
            type="number"
            name="minPrice"
            value={formData.minPrice}
            onChange={handleChange}
            placeholder="Min Price"
            min={0}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          <span className="text-center">to</span>
          <input
            type="number"
            name="maxPrice"
            value={formData.maxPrice}
            onChange={handleChange}
            placeholder="Max Price"
            min={0}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>

        {/* City & Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            required
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            required
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>

        {/* Latitude & Longitude */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            placeholder="Latitude"
            required
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          <input
            type="text"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            placeholder="Longitude"
            required
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2">
          {formData.amenities.map((amenity, index) => (
            <span
              key={index}
              className="bg-blue-200 text-blue-800 px-2 py-1 rounded flex items-center gap-1"
            >
              {amenity}
              <button
                type="button"
                onClick={() => handleRemoveAmenity(amenity)}
                className="text-red-500 font-bold ml-1"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            value={selectedAmenity}
            onChange={handleAmenitySelect}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          >
            <option value="">Select Amenity</option>
            {amenitiesOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {selectedAmenity === "Other" && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Enter New Amenity"
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
              <button
                type="button"
                onClick={handleAddNewAmenity}
                className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Capacity & Popularity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="number"
            name="adults"
            value={formData.adults}
            onChange={handleChange}
            placeholder="Adults Capacity"
            required
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          <input
            type="number"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            placeholder="Bedrooms"
            required
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>

        <select
          name="popularity"
          value={formData.popularity}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        >
          <option value="">Select Popularity</option>
          {[...Array(10)].map((_, i) => (
            <option key={i+1} value={i+1}>{i+1}</option>
          ))}
        </select>

        {/* Images */}
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleImageChange}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />

        {/* WhatsApp & Instagram */}
        <input
          type="text"
          name="whatsappNumber"
          value={formData.whatsappNumber}
          onChange={handleChange}
          placeholder="WhatsApp Number"
          required
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
         <input
          type="text"
          name="call"
          value={formData.call}
          onChange={handleChange}
          placeholder="phone Number"
          required
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        <input
          type="text"
          name="instagram"
          value={formData.instagram}
          onChange={handleChange}
          placeholder="Instagram UserID"
          required
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => 
              navigate("/admin/properties")
            }
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Go Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPropertyForm;
