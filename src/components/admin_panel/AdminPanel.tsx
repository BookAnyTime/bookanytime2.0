
// import { Link, Outlet, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { Button, Form } from "react-bootstrap";
// import { useAuth } from "@/contexts/AuthContext";
// import { Home, LogOut } from "lucide-react";
// import "./AdminPanel.css";
// import AddRatings from "./ratings/AddRatings";
// import DeleteRatings from "./ratings/DeleteRatings";

// const AdminPanel = () => {
//   const { user, logout, isAuthenticated } = useAuth();
//   const navigate = useNavigate();

//   const [showAddCategory, setShowAddCategory] = useState(false);
//   const [showDeleteCategory, setShowDeleteCategory] = useState(false);
//   const [categoryName, setCategoryName] = useState("");
//   const [categoryImage, setCategoryImage] = useState<File | null>(null);
//   const [categoryPreview, setCategoryPreview] = useState<string | null>(null);
//   const [categories, setCategories] = useState<any[]>([]);
//   const [selectedCategoryId, setSelectedCategoryId] = useState("");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isAddRatingsOpen, setIsAddRatingsOpen] = useState(false);
//   const [isDeleteRatingsOpen, setIsDeleteRatingsOpen] = useState(false);

//   // Hide main header
//   useEffect(() => {
//     const mainHeader = document.querySelector(".main-header");
//     if (mainHeader) mainHeader.style.display = "none";
//     return () => {
//       if (mainHeader) mainHeader.style.display = "block";
//     };
//   }, []);

//   // Fetch categories
//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
//       if (Array.isArray(res.data)) setCategories(res.data);
//       else setCategories([]);
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//       setCategories([]);
//     }
//   };

//   const handleCategoryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setCategoryImage(file);
//       setCategoryPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleAddCategory = async () => {
//     if (!categoryName.trim()) return alert("Category name cannot be empty!");
//     const formData = new FormData();
//     formData.append("name", categoryName);
//     if (categoryImage) formData.append("image", categoryImage);

//     try {
//       await axios.post(`${import.meta.env.VITE_API_URL}/api/categories`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("Category added successfully!");
//       fetchCategories();
//       setShowAddCategory(false);
//       setCategoryName("");
//       setCategoryImage(null);
//       setCategoryPreview(null);
//     } catch (err: any) {
//       alert(err.response?.data?.message || "Failed to add category");
//     }
//   };

//   const handleDeleteCategory = async () => {
//     if (!selectedCategoryId) return alert("Please select a category to delete!");
//     if (!window.confirm("Are you sure you want to delete this category?")) return;

//     try {
//       await axios.delete(`${import.meta.env.VITE_API_URL}/api/categories/${selectedCategoryId}`);
//       alert("Category deleted successfully!");
//       fetchCategories();
//       setShowDeleteCategory(false);
//       setSelectedCategoryId("");
//     } catch (err: any) {
//       alert(err.response?.data?.message || "Failed to delete category");
//     }
//   };

//   const handleSidebarClick = () => {
//     setShowAddCategory(false);
//     setShowDeleteCategory(false);
//     setIsAddRatingsOpen(false);
//     setIsDeleteRatingsOpen(false);
//     setSidebarOpen(false);
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   return (
//     <div className="admin-container">
//       {/* Header */}
//       <header className="admin-header">
//         <div className="header-left">
//           <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
//           <h3>Admin Panel</h3>
//         </div>
//         <div className="header-right">
//           <Button variant="light" className="me-2" onClick={() => navigate("/")}>
//             <Home size={18} /> Back to Home
//           </Button>
//           <Button variant="danger" onClick={handleLogout}>
//             <LogOut size={18} /> Logout
//           </Button>
//         </div>
//       </header>

//       {/* Sidebar */}
//       <nav className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
//         <ul>
//           <li><Link to="/admin/properties" onClick={handleSidebarClick}>Properties</Link></li>
//           <li><Link to="/admin/offers" onClick={handleSidebarClick}>Offers</Link></li>
//           <li><Link to="/admin/trackData" onClick={handleSidebarClick}>Tracked Data</Link></li>
//           <li><Link to="/admin/list-property-logs" onClick={handleSidebarClick}>List Property Logs</Link></li>
//           <li><Link to="/admin/feedback-logs" onClick={handleSidebarClick}>Feedback</Link></li>
//         </ul>

//         <Button
//           variant="success"
//           className="mt-3 w-100"
//           onClick={() => {
//             setShowAddCategory(true);
//             setShowDeleteCategory(false);
//             setIsAddRatingsOpen(false);
//             setIsDeleteRatingsOpen(false);
//           }}
//         >
//           + Add Category
//         </Button>

//         <Button
//           variant="danger"
//           className="mt-2 w-100"
//           onClick={() => {
//             setShowDeleteCategory(true);
//             setShowAddCategory(false);
//             setIsAddRatingsOpen(false);
//             setIsDeleteRatingsOpen(false);
//           }}
//         >
//           🗑️ Delete Category
//         </Button>

//         <Button
//           variant="success"
//           className="mt-2 w-100"
//           onClick={() => {
//             setIsAddRatingsOpen(true);
//             setShowAddCategory(false);
//             setShowDeleteCategory(false);
//             setIsDeleteRatingsOpen(false);
//           }}
//         >
//           + Add Ratings
//         </Button>

//         <Button
//           variant="danger"
//           className="mt-2 w-100"
//           onClick={() => {
//             setIsDeleteRatingsOpen(true);
//             setShowAddCategory(false);
//             setShowDeleteCategory(false);
//             setIsAddRatingsOpen(false);
//           }}
//         >
//           🗑️ Delete Ratings
//         </Button>
//       </nav>

//       {/* Content */}
//       <div className="admin-content">
//         <Outlet />
//       </div>

//       {/* Add Category Modal */}
//       {showAddCategory && (
//         <div className="modal-overlay">
//           <div className="modal-container">
//             <h3>Add Category</h3>
//             <Form>
//               <Form.Group>
//                 <Form.Label>Category Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={categoryName}
//                   onChange={(e) => setCategoryName(e.target.value)}
//                 />
//               </Form.Group>

//               <Form.Group className="mt-3">
//                 <Form.Label>Upload Image</Form.Label>
//                 <Form.Control type="file" accept="image/*" onChange={handleCategoryImageChange} />
//               </Form.Group>

//               {categoryPreview && <img src={categoryPreview} alt="Preview" className="preview-image mt-2" />}

//               <div className="modal-buttons mt-3">
//                 <Button variant="secondary" onClick={() => setShowAddCategory(false)}>Cancel</Button>
//                 <Button variant="primary" onClick={handleAddCategory}>Add</Button>
//               </div>
//             </Form>
//           </div>
//         </div>
//       )}

//       {/* Delete Category Modal */}
//       {showDeleteCategory && (
//         <div className="modal-overlay">
//           <div className="modal-container">
//             <h3>Delete Category</h3>
//             <Form.Group>
//               <Form.Label>Select Category</Form.Label>
//               <Form.Select
//                 value={selectedCategoryId}
//                 onChange={(e) => setSelectedCategoryId(e.target.value)}
//               >
//                 <option value="">Select a category</option>
//                 {categories.map(cat => (
//                   <option key={cat._id} value={cat._id}>{cat.name}</option>
//                 ))}
//               </Form.Select>
//             </Form.Group>

//             <div className="modal-buttons mt-3">
//               <Button variant="secondary" onClick={() => setShowDeleteCategory(false)}>Cancel</Button>
//               <Button variant="danger" onClick={handleDeleteCategory}>Delete</Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add/Delete Ratings */}
//       {isAddRatingsOpen && <AddRatings open={isAddRatingsOpen} onClose={() => setIsAddRatingsOpen(false)} />}
//       {isDeleteRatingsOpen && <DeleteRatings open={isDeleteRatingsOpen} onClose={() => setIsDeleteRatingsOpen(false)} />}
//     </div>
//   );
// };

// export default AdminPanel;


import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import { useAuth } from "@/contexts/AuthContext";
import { Home, LogOut } from "lucide-react";
import "./AdminPanel.css";
import AddRatings from "./ratings/AddRatings";
import DeleteRatings from "./ratings/DeleteRatings";

const AdminPanel = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showDeleteCategory, setShowDeleteCategory] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [categoryPreview, setCategoryPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddRatingsOpen, setIsAddRatingsOpen] = useState(false);
  const [isDeleteRatingsOpen, setIsDeleteRatingsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Hide main header
  useEffect(() => {
    const mainHeader = document.querySelector(".main-header");
    if (mainHeader) mainHeader.style.display = "none";
    return () => {
      if (mainHeader) mainHeader.style.display = "block";
    };
  }, []);

  // Detect mobile view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
      if (Array.isArray(res.data)) setCategories(res.data);
      else setCategories([]);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    }
  };

  const handleCategoryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCategoryImage(file);
      setCategoryPreview(URL.createObjectURL(file));
    }
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim()) return alert("Category name cannot be empty!");
    const formData = new FormData();
    formData.append("name", categoryName);
    if (categoryImage) formData.append("image", categoryImage);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/categories`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Category added successfully!");
      fetchCategories();
      setShowAddCategory(false);
      setCategoryName("");
      setCategoryImage(null);
      setCategoryPreview(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add category");
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategoryId) return alert("Please select a category to delete!");
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/categories/${selectedCategoryId}`);
      alert("Category deleted successfully!");
      fetchCategories();
      setShowDeleteCategory(false);
      setSelectedCategoryId("");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete category");
    }
  };

  const handleSidebarClick = () => {
    setShowAddCategory(false);
    setShowDeleteCategory(false);
    setIsAddRatingsOpen(false);
    setIsDeleteRatingsOpen(false);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <h3>Admin Panel</h3>
        </div>

        {/* Only show buttons in header if not mobile */}
        {!isMobile && (
          <div className="header-right">
            <Button variant="light" className="me-2" onClick={() => navigate("/")}>
              <Home size={18} /> Back to Home
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              <LogOut size={18} /> Logout
            </Button>
          </div>
        )}
      </header>

      {/* Sidebar */}
      <nav className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <ul>
          <li><Link to="/admin/properties" onClick={handleSidebarClick}>Properties</Link></li>
          <li><Link to="/admin/offers" onClick={handleSidebarClick}>Offers</Link></li>
          <li><Link to="/admin/trackData" onClick={handleSidebarClick}>Tracked Data</Link></li>
          <li><Link to="/admin/list-property-logs" onClick={handleSidebarClick}>List Property Logs</Link></li>
          <li><Link to="/admin/feedback-logs" onClick={handleSidebarClick}>Feedback</Link></li>
        </ul>

        {/* On mobile, move Home + Logout here */}
        {isMobile && (
          <div className="mt-3">
            <Button variant="light" className="w-100 mb-2" onClick={() => { handleSidebarClick(); navigate("/"); }}>
              <Home size={18} /> Back to Home
            </Button>
            <Button variant="danger" className="w-100" onClick={handleLogout}>
              <LogOut size={18} /> Logout
            </Button>
          </div>
        )}

        <Button
          variant="success"
          className="mt-3 w-100"
          onClick={() => {
            setShowAddCategory(true);
            setShowDeleteCategory(false);
            setIsAddRatingsOpen(false);
            setIsDeleteRatingsOpen(false);
          }}
        >
          + Add Category
        </Button>

        <Button
          variant="danger"
          className="mt-2 w-100"
          onClick={() => {
            setShowDeleteCategory(true);
            setShowAddCategory(false);
            setIsAddRatingsOpen(false);
            setIsDeleteRatingsOpen(false);
          }}
        >
          🗑️ Delete Category
        </Button>

        <Button
          variant="success"
          className="mt-2 w-100"
          onClick={() => {
            setIsAddRatingsOpen(true);
            setShowAddCategory(false);
            setShowDeleteCategory(false);
            setIsDeleteRatingsOpen(false);
          }}
        >
          + Add Ratings
        </Button>

        <Button
          variant="danger"
          className="mt-2 w-100"
          onClick={() => {
            setIsDeleteRatingsOpen(true);
            setShowAddCategory(false);
            setShowDeleteCategory(false);
            setIsAddRatingsOpen(false);
          }}
        >
          🗑️ Delete Ratings
        </Button>
      </nav>

      {/* Content */}
      <div className="admin-content">
        <Outlet />
      </div>

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3>Add Category</h3>
            <Form>
              <Form.Group>
                <Form.Label>Category Name</Form.Label>
                <Form.Control
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Upload Image</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleCategoryImageChange} />
              </Form.Group>

              {categoryPreview && <img src={categoryPreview} alt="Preview" className="preview-image mt-2" />}

              <div className="modal-buttons mt-3">
                <Button variant="secondary" onClick={() => setShowAddCategory(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleAddCategory}>Add</Button>
              </div>
            </Form>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      {showDeleteCategory && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3>Delete Category</h3>
            <Form.Group>
              <Form.Label>Select Category</Form.Label>
              <Form.Select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="modal-buttons mt-3">
              <Button variant="secondary" onClick={() => setShowDeleteCategory(false)}>Cancel</Button>
              <Button variant="danger" onClick={handleDeleteCategory}>Delete</Button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Delete Ratings */}
      {isAddRatingsOpen && <AddRatings open={isAddRatingsOpen} onClose={() => setIsAddRatingsOpen(false)} />}
      {isDeleteRatingsOpen && <DeleteRatings open={isDeleteRatingsOpen} onClose={() => setIsDeleteRatingsOpen(false)} />}
    </div>
  );
};

export default AdminPanel;
