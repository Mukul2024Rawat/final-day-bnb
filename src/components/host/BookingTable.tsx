import React, { useEffect, useState } from 'react';
import { api } from '@/api';
import toast, { Toaster } from 'react-hot-toast';

interface Booking {
  id: number;
  checkin_date: string;
  checkout_date: string;
  booking_date: string;
  members: number;
  booking_status: 'pending' | 'confirm' | 'reject';
  total_amount: string;
  property: {
    id: number;
    title: string;
  };
  guest: {
    name: string;
  };
}

const fetchBookings = async (): Promise<Booking[]> => {
  try {
    const response = await api.get('/host/booking', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

const updateBookingStatus = async (bookingId: number, status: 'confirm' | 'reject'): Promise<void> => {
  try {
    const response = await api.patch(
      `/host/booking/${bookingId}/status`,
      { booking_status: status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

const BookingTable: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setIsLoading(true);
        const data = await fetchBookings();
        setBookings(data);
      } catch (error) {
        setError('Failed to load bookings. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, []);

  const handleStatusChange = async (id: number, status: 'confirm' | 'reject') => {
    try {
      const response = await updateBookingStatus(id, status);
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === id ? { ...booking, booking_status: status } : booking
        )
      );
      setOpenDropdown(null);
      toast.success(`Booking ${status === 'confirm' ? 'confirmed' : 'rejected'} successfully`, {
        position: 'bottom-right',
      });
    } catch (error: any) {
      console.error('Error updating booking status:', error);
      let errorMessage = 'An error occurred while updating the booking status.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message[0].message;
      }
      toast.error(errorMessage, {
        position: 'bottom-right',
      });
    } finally {
      setOpenDropdown(null); // Ensure dropdown is closed even if there's an error
    }
  };

  const getStayDuration = (checkinDate: string, checkoutDate: string) => {
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);
    const diffTime = Math.abs(checkout.getTime() - checkin.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days (${checkin.toLocaleDateString()} - ${checkout.toLocaleDateString()})`;
  };

  if (isLoading) return <div className="text-center py-4">Loading bookings...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <Toaster />
      {/* Table for larger screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Booking ID</th>
              <th className="py-2 px-4 border-b">Guest Name</th>
              <th className="py-2 px-4 border-b">Property Title</th>
              <th className="py-2 px-4 border-b">Stay Duration</th>
              <th className="py-2 px-4 border-b">Payment</th>
              <th className="py-2 px-4 border-b">Order Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{booking.id}</td>
                <td className="py-2 px-4 border-b">{booking.guest.name}</td>
                <td className="py-2 px-4 border-b">{booking.property.title}</td>
                <td className="py-2 px-4 border-b">
                  {getStayDuration(booking.checkin_date, booking.checkout_date)}
                </td>
                <td className="py-2 px-4 border-b">${booking.total_amount}</td>
                <td className="py-2 px-4 border-b">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    booking.booking_status === 'confirm' ? 'bg-green-100 text-green-800' :
                    booking.booking_status === 'reject' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}
                  </span>
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="relative">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === booking.id ? null : booking.id)}
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                      </svg>
                    </button>
                    {openDropdown === booking.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                        <button
                          onClick={() => handleStatusChange(booking.id, 'confirm')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'reject')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for smaller screens */}
      <div className="md:hidden space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-2">Booking ID: {booking.id}</h2>
            <p className="text-sm text-gray-500 mb-2">Guest: {booking.guest.name}</p>
            <p className="text-sm text-gray-500 mb-2">Property: {booking.property.title}</p>
            <p className="text-sm text-gray-500 mb-2">Stay: {getStayDuration(booking.checkin_date, booking.checkout_date)}</p>
            <p className="text-sm text-gray-500 mb-2">Payment: ${booking.total_amount}</p>
            <p className="text-sm mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                booking.booking_status === 'confirm' ? 'bg-green-100 text-green-800' :
                booking.booking_status === 'reject' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}
              </span>
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => handleStatusChange(booking.id, 'confirm')}
                className="text-green-500 hover:text-green-700 focus:outline-none"
              >
                Confirm
              </button>
              <button
                onClick={() => handleStatusChange(booking.id, 'reject')}
                className="text-red-500 hover:text-red-700 focus:outline-none"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingTable;
