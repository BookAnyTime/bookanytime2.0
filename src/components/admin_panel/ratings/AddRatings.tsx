
import { useState, useEffect } from "react";
import { Button, Modal, TextField, MenuItem, Box, Typography } from "@mui/material";
import axios from "axios";

const AddRatings = ({ open, onClose }) => {
  const [ratings, setRatings] = useState({
    category: "",
    propertyId: "",
    username: "",
    month: "",
    year: "",
    rating: "",
    description: "",
  });

  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Fetch categories
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Fetch properties when category changes
  useEffect(() => {
    if (!ratings.category) {
      setProperties([]);
      setRatings((prev) => ({ ...prev, propertyId: "" }));
      return;
    }

    axios.get(`${import.meta.env.VITE_API_URL}/api/properties?category=${encodeURIComponent(ratings.category)}`)
      .then((res) => setProperties(res.data || []))
      .catch((err) => console.error("Error fetching properties:", err));
  }, [ratings.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRatings((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    setRatings({ ...ratings, category: e.target.value, propertyId: "" });
  };

  const handlePropertyChange = (e) => {
    setRatings((prev) => ({ ...prev, propertyId: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!ratings.propertyId || !ratings.username || !ratings.month || !ratings.year || !ratings.rating) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/ratings`, ratings);
      alert("Rating added successfully!");
      setRatings({
        category: "",
        propertyId: "",
        username: "",
        month: "",
        year: "",
        rating: "",
        description: "",
      });
      onClose();
    } catch (err) {
      console.error("Error adding rating:", err);
      alert("Failed to add rating.");
    }
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
          Add Ratings
        </Typography>

        {/* Category */}
        <TextField
          fullWidth
          select
          label="Select Category"
          value={ratings.category}
          onChange={handleCategoryChange}
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
          value={ratings.propertyId}
          onChange={handlePropertyChange}
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

        {/* Username */}
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={ratings.username}
          onChange={handleChange}
          margin="dense"
        />

        {/* Month */}
        <TextField
          fullWidth
          select
          label="Month"
          name="month"
          value={ratings.month}
          onChange={handleChange}
          margin="dense"
        >
          {months.map((month, index) => (
            <MenuItem key={index} value={month}>{month}</MenuItem>
          ))}
        </TextField>

        {/* Year */}
        <TextField
          fullWidth
          label="Year"
          type="number"
          name="year"
          value={ratings.year}
          onChange={handleChange}
          margin="dense"
        />

        {/* Rating */}
        <TextField
          fullWidth
          label="Rating (1-5)"
          type="number"
          name="rating"
          value={ratings.rating}
          onChange={handleChange}
          inputProps={{ min: 1, max: 5, step: 0.1 }}
          margin="dense"
        />

        {/* Description */}
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Description"
          name="description"
          value={ratings.description}
          onChange={handleChange}
          margin="dense"
        />

        {/* Buttons */}
        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={!ratings.propertyId || !ratings.username || !ratings.month || !ratings.year || !ratings.rating}
          >
            Submit
          </Button>
          <Button variant="outlined" color="secondary" fullWidth onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddRatings;
