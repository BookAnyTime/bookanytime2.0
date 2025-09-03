
import { useState, useEffect } from "react";
import { Button, Modal, Box, Typography, TextField, MenuItem } from "@mui/material";
import axios from "axios";

const DeleteRatings = ({ open, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedRating, setSelectedRating] = useState("");

  // Fetch categories
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Fetch properties when category changes
  useEffect(() => {
    if (!selectedCategory) return;

    axios.get(`${import.meta.env.VITE_API_URL}/api/properties?category=${encodeURIComponent(selectedCategory)}`)
      .then((res) => setProperties(res.data || []))
      .catch((err) => console.error("Error fetching properties:", err));
  }, [selectedCategory]);

  // Fetch ratings when property changes
  useEffect(() => {
    if (!selectedProperty) return;

    axios.get(`${import.meta.env.VITE_API_URL}/api/ratings/${selectedProperty}`)
      .then((res) => setRatings(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching ratings:", err));
  }, [selectedProperty]);

  const handleDelete = () => {
    if (!selectedRating) {
      alert("Please select a rating to delete");
      return;
    }

    axios.delete(`${import.meta.env.VITE_API_URL}/api/ratings/${selectedRating}`)
      .then(() => {
        alert("Rating deleted successfully!");
        setRatings(ratings.filter(r => r._id !== selectedRating));
        setSelectedRating("");
      })
      .catch((err) => console.error("Error deleting rating:", err));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          width: 350,
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" mb={2} textAlign="center">
          Delete Ratings
        </Typography>

        {/* Category */}
        <TextField
          fullWidth
          select
          label="Select Category"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setProperties([]);
            setSelectedProperty("");
            setRatings([]);
          }}
          margin="dense"
        >
          <MenuItem value="">Select Category</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat._id} value={cat.name}>{cat.name}</MenuItem>
          ))}
        </TextField>

        {/* Property */}
        <TextField
          fullWidth
          select
          label="Select Property"
          value={selectedProperty}
          onChange={(e) => {
            setSelectedProperty(e.target.value);
            setRatings([]);
          }}
          margin="dense"
          disabled={!properties.length}
        >
          <MenuItem value="">Select Property</MenuItem>
          {properties.map((prop) => (
            <MenuItem key={prop._id} value={prop._id}>
              {prop.name} - {prop.address}
            </MenuItem>
          ))}
        </TextField>

        {/* Rating */}
        <TextField
          fullWidth
          select
          label="Select Rating"
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
          margin="dense"
          disabled={!ratings.length}
        >
          <MenuItem value="">Select Rating</MenuItem>
          {ratings.map((r) => (
            <MenuItem key={r._id} value={r._id}>
              {r.username} - {r.month} {r.year} - {r.rating}⭐
            </MenuItem>
          ))}
        </TextField>

        {/* Buttons */}
        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleDelete}
            disabled={!selectedRating}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={onClose}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteRatings;
