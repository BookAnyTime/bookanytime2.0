
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Pagination } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import "./TrackedData.css";

const TrackedData = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");

  const isMobile = useMediaQuery({ maxWidth: 768 });
  const itemsPerPage = isMobile ? 5 : 15;

  // Fetch categories on mount
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Fetch properties when category changes
  useEffect(() => {
    if (!selectedCategory) {
      setProperties([]);
      setSelectedProperty("");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/properties?category=${encodeURIComponent(selectedCategory)}`)
      .then((res) => setProperties(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching properties:", err));
  }, [selectedCategory]);

  // Fetch contacts on mount
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/trackdata/contacts`);
        const allContacts = response.data.contacts || [];
        setContacts(allContacts);
        setFilteredContacts(allContacts);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  // Filter contacts when selected property changes
  useEffect(() => {
    if (!selectedProperty) {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact => contact.propertyId === selectedProperty);
      setFilteredContacts(filtered);
    }
    setCurrentPage(1); // Reset to first page
  }, [selectedProperty, contacts]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">Tracked Contacts</h2>

      {/* Filters */}
      <div className="d-flex gap-2 mb-3 flex-wrap">
        <select
          className="form-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>

        <select
          className="form-select"
          value={selectedProperty}
          onChange={(e) => setSelectedProperty(e.target.value)}
          disabled={!properties.length}
        >
          <option value="">Select Property</option>
          {properties.map((prop) => (
            <option key={prop._id} value={prop._id}>{prop.name} - {prop.address}</option>
          ))}
        </select>
      </div>

      {/* Contacts Table */}
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Sl.No</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Property Name</th>
              <th>Address</th>
              <th>Contact Date</th>
            </tr>
          </thead>
          <tbody>
            {currentContacts.length ? (
              currentContacts.map((contact, index) => (
                <tr key={contact._id}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{contact.userName}</td>
                  <td>{contact.userEmail}</td>
                  <td>{contact.userPhoneNumber}</td>
                  <td>{contact.propertyName}</td>
                  <td>{contact.propertyAddress}</td>
                  <td>{new Date(contact.contactDate).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center">No contacts found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="justify-content-center">
          <Pagination.Prev
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item
              key={i}
              active={i + 1 === currentPage}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      )}
    </div>
  );
};

export default TrackedData;
