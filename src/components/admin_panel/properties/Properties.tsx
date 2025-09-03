import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Properties = () => {
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({ category: "", propertyId: "" });
  const [updateData, setUpdateData] = useState({ category: "", propertyId: "" });
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch categories
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Fetch properties when category changes
  useEffect(() => {
    const category = deleteData.category || updateData.category;
    if (!category) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/properties?category=${encodeURIComponent(category)}`)
      .then((res) => setProperties(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching properties:", err));
  }, [deleteData.category, updateData.category]);

  const handleCategoryChange = (e, type) => {
    const category = e.target.value;
    if (type === "delete") setDeleteData({ category, propertyId: "" });
    else setUpdateData({ category, propertyId: "" });
  };

  const handlePropertyChange = (e, type) => {
    const propertyId = e.target.value;
    if (type === "delete") setDeleteData((prev) => ({ ...prev, propertyId }));
    else setUpdateData((prev) => ({ ...prev, propertyId }));
  };

  const handleDeleteSubmit = () => {
    if (!deleteData.propertyId) return alert("Please select a property to delete");

    axios
      .delete(`${import.meta.env.VITE_API_URL}/api/properties/${deleteData.propertyId}`)
      .then((res) => {
        alert(res.data.message || "Property deleted successfully");
        setDeleteModalOpen(false);
        setProperties(properties.filter((p) => p._id !== deleteData.propertyId));
      })
      .catch((err) => console.error("Error deleting property:", err));
  };

  const handleUpdateSubmit = () => {
    if (!updateData.propertyId) return alert("Please select a property to update");

    navigate(`/admin/update-property/${updateData.propertyId}`);
  };

  const ModalWrapper = ({ open, onClose, title, children }) => (
    open ? (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-80">
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          {children}
          <button
            className="mt-4 w-full py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    ) : null
  );

  return (
    <div className="max-w-4xl mx-auto mt-10 text-center">
      <h2 className="text-2xl font-bold mb-6">Admin Panel - Properties</h2>

      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate("/admin/add-property")}
        >
          Add Property
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={() => setDeleteModalOpen(true)}
        >
          Delete Property
        </button>
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          onClick={() => setUpdateModalOpen(true)}
        >
          Update Property
        </button>
      </div>

      {/* Delete Modal */}
      <ModalWrapper open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Property">
        <select
          className="border border-gray-300 rounded px-3 py-2 w-full mb-2"
          value={deleteData.category}
          onChange={(e) => handleCategoryChange(e, "delete")}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <select
          className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
          value={deleteData.propertyId}
          onChange={(e) => handlePropertyChange(e, "delete")}
          disabled={!properties.length}
        >
          <option value="">Select Property</option>
          {properties.map((prop) => (
            <option key={prop._id} value={prop._id}>{prop.name} - {prop.address}</option>
          ))}
        </select>
        <button
          className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={handleDeleteSubmit}
          disabled={!deleteData.propertyId}
        >
          Confirm Delete
        </button>
      </ModalWrapper>

      {/* Update Modal */}
      <ModalWrapper open={updateModalOpen} onClose={() => setUpdateModalOpen(false)} title="Update Property">
        <select
          className="border border-gray-300 rounded px-3 py-2 w-full mb-2"
          value={updateData.category}
          onChange={(e) => handleCategoryChange(e, "update")}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <select
          className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
          value={updateData.propertyId}
          onChange={(e) => handlePropertyChange(e, "update")}
          disabled={!properties.length}
        >
          <option value="">Select Property</option>
          {properties.map((prop) => (
            <option key={prop._id} value={prop._id}>{prop.name} - {prop.address}</option>
          ))}
        </select>
        <button
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleUpdateSubmit}
          disabled={!updateData.propertyId}
        >
          Proceed to Update
        </button>
      </ModalWrapper>
    </div>
  );
};

export default Properties;
