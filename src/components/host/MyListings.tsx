'use client';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FcViewDetails } from "react-icons/fc";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import { Property } from '@/types/PropertyDetails';
import { api } from '@/api';
import PropertyDetailsModal from './PropertyDetails'; // Make sure this import path is correct

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  propertyTitle: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, propertyTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-4">Are you sure you want to delete the property "{propertyTitle}"?</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

interface FeedbackMessageProps {
  message: string;
  type: 'success' | 'error';
}

const FeedbackMessage: React.FC<FeedbackMessageProps> = ({ message, type }) => {
  return (
    <div className={`fixed top-16 right-4 p-4 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
      {message}
    </div>
  );
};

interface ActionButtonProps {
  onClick?: () => void;
  icon: React.ReactNode;
  label: string;
  color: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, icon, label, color }) => (
  <button
    onClick={onClick}
    className={`text-${color}-500 hover:text-${color}-700 transition-colors duration-200`}
    aria-label={label}
  >
    {icon}
  </button>
);

const MyListings: NextPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isPropertyDetailsModalOpen, setIsPropertyDetailsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await api.get('/property/host', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(response.data)) {
          setProperties(response.data);
        } else {
          throw new Error('Unexpected response data');
        }
      } catch (error) {
        console.error('Error fetching properties', error);
        setError('Failed to fetch properties. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleDeleteClick = (property: Property) => {
    setPropertyToDelete(property);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!propertyToDelete) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await api.delete(`/property/${propertyToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProperties(properties.filter(property => property.id !== propertyToDelete.id));
      setFeedbackMessage({ message: 'Property deleted successfully', type: 'success' });
    } catch (error) {
      console.error('Error deleting property', error);
      setFeedbackMessage({ message: 'Failed to delete property. Please try again.', type: 'error' });
    } finally {
      setIsDeleteModalOpen(false);
      setPropertyToDelete(null);
      setTimeout(() => setFeedbackMessage(null), 5000);
    }
  };

  const handleEditClick = (property: Property) => {
    setSelectedProperty(property);
    setIsPropertyDetailsModalOpen(true);
  };

  const handlePropertyUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.get('/property/host', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data)) {
        setProperties(response.data);
        setFeedbackMessage({ message: 'Property updated successfully', type: 'success' });
      } else {
        throw new Error('Unexpected response data');
      }
    } catch (error) {
      console.error('Error updating properties', error);
      setFeedbackMessage({ message: 'Failed to update property. Please try again.', type: 'error' });
    } finally {
      setTimeout(() => setFeedbackMessage(null), 5000);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Head>
        <title>My Listings</title>
        <meta name="description" content="Airbnb Host Listings" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
   
      <div className="flex-1 p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Listings</h1>
        {properties.length > 0 ? (
          <>
            {/* Table for larger screens */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left">Property ID</th>
                    <th className="py-3 px-4 text-left">Title</th>
                    <th className="py-3 px-4 text-left">Address</th>
                    <th className="py-3 px-4 text-left">Price</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property) => (
                    <tr key={property.id} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-4">{property.id}</td>
                      <td className="py-3 px-4">{property.title}</td>
                      <td className="py-3 px-4">
                        {property.property_address
                          ? `${property.property_address.city}, ${property.property_address.state}`
                          : 'N/A'}
                      </td>
                      <td className="py-3 px-4">{property.property_price ? `$${property.property_price.price}` : 'N/A'}</td>
                      <td className="py-3 px-4 flex space-x-4">
                        <Link href={`/guest/property/${property.id}`} passHref>
                          <ActionButton
                            icon={<FcViewDetails size={24} />}
                            label="View Details"
                            color="blue"
                          />
                        </Link>
                        <ActionButton
                          onClick={() => handleEditClick(property)}
                          icon={<TbEdit size={24} />}
                          label="Edit Property"
                          color="green"
                        />
                        <ActionButton
                          onClick={() => handleDeleteClick(property)}
                          icon={<RiDeleteBin6Line size={24} />}
                          label="Delete Property"
                          color="red"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards for smaller screens */}
            <div className="md:hidden space-y-4">
              {properties.map((property) => (
                <div key={property.id} className="bg-white rounded-lg shadow-md p-4">
                  <h2 className="text-xl font-semibold mb-2">{property.title}</h2>
                  <p className="text-sm text-gray-500 mb-2">
                    {property.property_address
                      ? `${property.property_address.city}, ${property.property_address.state}, ${property.property_address.country}`
                      : 'N/A'}
                  </p>
                  <p className="text-lg font-bold mb-3">{property.property_price ? `$${property.property_price.price}` : 'N/A'}</p>
                  <div className="flex justify-end space-x-4">
                    <Link href={`/guest/property/${property.id}`} passHref>
                      <ActionButton
                        icon={<FcViewDetails size={24} />}
                        label="View Details"
                        color="blue"
                      />
                    </Link>
                    <ActionButton
                      onClick={() => handleEditClick(property)}
                      icon={<TbEdit size={24} />}
                      label="Edit Property"
                      color="green"
                    />
                    <ActionButton
                      onClick={() => handleDeleteClick(property)}
                      icon={<RiDeleteBin6Line size={24} />}
                      label="Delete Property"
                      color="red"
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-600 text-lg">No properties found.</p>
        )}
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        propertyTitle={propertyToDelete?.title || ''}
      />

      {selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          isOpen={isPropertyDetailsModalOpen}
          onClose={() => setIsPropertyDetailsModalOpen(false)}
          onUpdate={handlePropertyUpdate}
        />
      )}

      {feedbackMessage && (
        <FeedbackMessage message={feedbackMessage.message} type={feedbackMessage.type} />
      )}
    </div>
  );
};

export default MyListings;