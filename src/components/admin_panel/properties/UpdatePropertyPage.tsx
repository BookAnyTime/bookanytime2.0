import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, MenuItem, Button, Grid, Paper, Typography, CircularProgress, Chip, Box } from "@mui/material";

const UpdatePropertyPage = () => {
  const { id } = useParams();
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
    capacity: { adults: "", bedrooms: "" },
    popularity: "",
    images: [],
    whatsappNumber: "",
    instagram: "",
    call:""
  });

  const [existingImages, setExistingImages] = useState([]); // Store existing images
  const [newImages, setNewImages] = useState([]); // New images to upload
  const [loading, setLoading] = useState(false);
  const [newAmenity, setNewAmenity] = useState("");
  const [selectedAmenity, setSelectedAmenity] = useState("");
  const amenitiesOptions = ["WiFi", "Swimming Pool", "Other"];
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Fetch property details
  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/properties/${id}`);
        const property = res.data;
        setFormData({
          ...property,
          capacity: property.capacity || { adults: "", bedrooms: "" },
        });
        setExistingImages(property.images || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load property data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "adults" || name === "bedrooms") {
      setFormData((prev) => ({ ...prev, capacity: { ...prev.capacity, [name]: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    setNewImages([...newImages, ...Array.from(e.target.files)]);
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

  const handleRemoveAmenity = (amenity) => {
    setFormData((prev) => ({ ...prev, amenities: prev.amenities.filter((a) => a !== amenity) }));
  };

  const handleRemoveExistingImage = (img) => {
    setExistingImages(existingImages.filter((i) => i !== img));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();

    // Append updated fields
    Object.keys(formData).forEach((key) => {
      if (key !== "images" && key !== "capacity") form.append(key, formData[key]);
    });

    // Append capacity
    form.append("capacity[adults]", formData.capacity.adults);
    form.append("capacity[bedrooms]", formData.capacity.bedrooms);

    // Append newly selected images
    newImages.forEach((file) => form.append("images", file));

    // Include existing images that were not removed
    form.append("existingImages", JSON.stringify(existingImages));

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/properties/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Property updated successfully!");
      navigate("/admin/properties");
    } catch (err) {
      console.error(err);
      alert("Failed to update property.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 900, m: "20px auto" }}>
      <Typography variant="h5" align="center" gutterBottom>Update Property</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Property Name */}
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Property Name" name="name" value={formData.name} onChange={handleChange} required />
            </Grid>

            {/* Category */}
            <Grid item xs={12} sm={6}>
              <TextField select fullWidth label="Category" name="category" value={formData.category} onChange={handleChange} required>
                {categories.map((c) => <MenuItem key={c._id} value={c.name}>{c.name}</MenuItem>)}
              </TextField>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField fullWidth label="Description" multiline rows={3} name="description" value={formData.description} onChange={handleChange} required />
            </Grid>

            {/* House Rules */}
            <Grid item xs={12}>
              <TextField fullWidth label="House Rules" multiline rows={3} name="house_rules" value={formData.house_rules} onChange={handleChange} required />
            </Grid>

            {/* Price Range */}
            <Grid item xs={6}>
              <TextField fullWidth type="number" label="Min Price" name="minPrice" value={formData.minPrice} onChange={handleChange} required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth type="number" label="Max Price" name="maxPrice" value={formData.maxPrice} onChange={handleChange} required />
            </Grid>

            {/* City & Address */}
            <Grid item xs={6}><TextField fullWidth label="City" name="city" value={formData.city} onChange={handleChange} required /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} required /></Grid>

            {/* Latitude & Longitude */}
            <Grid item xs={6}><TextField fullWidth label="Latitude" name="latitude" value={formData.latitude} onChange={handleChange} required /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Longitude" name="longitude" value={formData.longitude} onChange={handleChange} required /></Grid>

            {/* Amenities */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Selected Amenities:</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {formData.amenities.map((amenity) => (
                  <Chip key={amenity} label={amenity} onDelete={() => handleRemoveAmenity(amenity)} />
                ))}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <TextField select fullWidth label="Select Amenity" value={selectedAmenity} onChange={handleAmenitySelect}>
                {amenitiesOptions.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
              </TextField>
            </Grid>
            {selectedAmenity === "Other" && (
              <Grid item xs={6}>
                <TextField fullWidth label="New Amenity" value={newAmenity} onChange={(e) => setNewAmenity(e.target.value)} />
                <Button variant="contained" sx={{ mt: 1 }} onClick={handleAddNewAmenity}>Add Amenity</Button>
              </Grid>
            )}

            {/* Capacity */}
            <Grid item xs={6}><TextField fullWidth type="number" label="Adults" name="adults" value={formData.capacity.adults} onChange={handleChange} required /></Grid>
            <Grid item xs={6}><TextField fullWidth type="number" label="Bedrooms" name="bedrooms" value={formData.capacity.bedrooms} onChange={handleChange} required /></Grid>

            {/* Popularity */}
            <Grid item xs={6}>
              <TextField select fullWidth label="Popularity" name="popularity" value={formData.popularity} onChange={handleChange}>
                {[...Array(10)].map((_, i) => <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>)}
              </TextField>
            </Grid>

            {/* Existing Images */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Existing Images:</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {existingImages.map((img, idx) => (
                  <Box key={idx} sx={{ position: "relative" }}>
                    <img src={img} alt="property" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 4 }} />
                    <Button size="small" sx={{ position: "absolute", top: 0, right: 0 }} onClick={() => handleRemoveExistingImage(img)}>x</Button>
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* New Images Upload */}
            <Grid item xs={12}>
              <input type="file" multiple ref={fileInputRef} onChange={handleImageChange} />
            </Grid>

            {/* WhatsApp & Instagram */}
            <Grid item xs={6}><TextField fullWidth label="WhatsApp Number" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} required /></Grid>
            <Grid item xs={6}><TextField fullWidth label="phone Number" name="call" value={formData.call} onChange={handleChange} required /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Instagram UserID" name="instagram" value={formData.instagram} onChange={handleChange} required /></Grid>

            {/* Submit & Go Back */}
            <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
              <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mr: 2 }}>
                {loading ? <CircularProgress size={24} /> : "Update Property"}
              </Button>
              <Button variant="outlined" onClick={() => navigate("/admin/properties")}>Go Back</Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Paper>
  );
};

export default UpdatePropertyPage;
