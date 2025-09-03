
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddOfferModal from "./AddOffersModal";
import DeleteOfferModal from "./DeleteOffersModal";
import UpdateOfferModal from "./UpdateOfferModal";

const OffersPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="container mx-auto mt-8 px-4">
      {/* Top Back Button to Admin Page */}
      {/* <button
        className="mb-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        onClick={() => navigate("/admin")}
      >
        ← Back to Admin Page
      </button> */}

      <h2 className="text-2xl font-bold mb-6">Manage Offers</h2>

      <div className="flex flex-wrap gap-4 mb-6">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setShowAddModal(true)}
        >
          Add Offer
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete Offer
        </button>
        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          onClick={() => setShowUpdateModal(true)}
        >
          Update Offer
        </button>
      </div>

      {/* Modals */}
      <AddOfferModal show={showAddModal} handleClose={() => setShowAddModal(false)} />
      <DeleteOfferModal show={showDeleteModal} handleClose={() => setShowDeleteModal(false)} />
      <UpdateOfferModal show={showUpdateModal} handleClose={() => setShowUpdateModal(false)} />
    </div>
  );
};

export default OffersPage;
