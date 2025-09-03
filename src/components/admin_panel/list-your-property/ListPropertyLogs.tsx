import React, { useEffect, useState } from "react";
import axios from "axios";

const ListYourPropertyLogs = () => {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/list-property`
      );
      setProperties(response.data);
    } catch (err) {
      setError("Failed to fetch data");
    }
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <h2 className="text-center text-2xl font-bold mb-6">
        List Your Property Logs
      </h2>

      {error && (
        <p className="text-red-600 text-center mb-4">{error}</p>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 divide-y divide-gray-300">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Sl.No</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Category</th>
              {/* <th className="px-4 py-2 text-left">Date</th> */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-300">
            {properties.length > 0 ? (
              properties.map((property, index) => (
                <tr key={property._id} className="hover:bg-gray-100">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{property.name}</td>
                  <td className="px-4 py-2">{property.phone}</td>
                  <td className="px-4 py-2">{property.email}</td>
                  <td className="px-4 py-2">{property.category}</td>
                  {/* <td className="px-4 py-2">{new Date(property.createdAt).toLocaleString()}</td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-4 text-center text-gray-500"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListYourPropertyLogs;
