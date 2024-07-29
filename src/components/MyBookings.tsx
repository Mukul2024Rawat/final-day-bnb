"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchUserBookings, cancelBooking } from "../api/index";
import WithAuth from "./withAuth";
import { Booking } from "@/types/userAuthentication";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaDollarSign,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaStar,
} from "react-icons/fa";
import Loader from "../components/modals/Loader";
import toast from "react-hot-toast";
import ReviewModal from "../components/modals/ReviewModal";

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirm":
      return "text-green-500";
    case "pending":
      return "text-yellow-500";
    case "cancelled":
      return "text-red-500";
    case "reject":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

// Utility function to format the date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
// Utility function to format the time in 12-hour format with AM/PM
const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  let hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12;
  return `${hour}:${minutes} ${ampm}`;
};

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (errorMessages.length > 0) {
      const timer = setTimeout(() => {
        setErrorMessages([]);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [errorMessages]);

  const fetchBookings = async () => {
    setIsLoading(true);
    setError("");
    setErrorMessages([]);
    try {
      const response = await fetchUserBookings()
      setBookings(response);
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessages(
          error.response.data.message.map((msg: any) => msg.message)
        );
      }
      console.error("Failed to fetch bookings", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (id: string) => {
    setIsLoading(true);
    setError("");
    setErrorMessages([]);
    try {
      await cancelBooking(id);
      await fetchBookings();
      toast.success("Booking cancelled successfully!");
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessages(
          error.response.data.message.map((msg: any) => msg.message)
        );
      }
      console.error("Failed to cancel booking", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openReviewModal = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setSelectedBookingId(null);
    setIsReviewModalOpen(false);
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-4">My Bookings</h2>
      {errorMessages.length > 0 && (
        <div className="bg-red-500 text-white p-4 mb-4 rounded-lg">
          <p className="font-bold">Error Occurred:</p>
          <ul className="list-disc ml-5">
            {errorMessages.map((errorMessage, index) => (
              <li key={index}>{errorMessage}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex justify-center bg-white p-6 rounded-lg shadow-md">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="text-gray-500 text-lg">No Bookings Yet</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300 w-full md:w-92"
              >
                <Image
                  src={booking.imageUrl}
                  alt={booking.placeName}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg">{booking.placeName}</h3>
                  <p className="flex items-center mt-2">
                    <FaMapMarkerAlt className="mr-2" />
                    {booking.address}
                  </p>
                  <p
                    className={`flex items-center mt-2 ${getStatusColor(
                      booking.status
                    )} font-semibold`}
                  >
                    <FaCalendarAlt className="mr-2" />
                    {booking.status}
                  </p>
                  <p className="flex items-center mt-2">
                    <FaUser className="mr-2" />
                    Host: {booking.hostName}
                  </p>
                  <p className="flex items-center mt-2">
                    <FaDollarSign className="mr-2" />
                    {booking.totalPrice}
                  </p>
                  <p className="flex items-center mt-2">
                    <FaCalendarAlt className="mr-2" />
                    Check-In: {formatDate(booking.checkInDate)} at{" "}
                    {formatTime(booking.checkInTime)}
                  </p>
                  <p className="flex items-center mt-2">
                    <FaCalendarAlt className="mr-2" />
                    Check-Out: {formatDate(booking.checkOutDate)} at{" "}
                    {formatTime(booking.checkOutTime)}
                  </p>
                  <p className="flex items-center mt-2">
                    <FaUsers className="mr-2" />
                    No. of Persons: {booking.persons}
                  </p>
                  {booking.visitCompleted ? (
                    <p className="flex items-center text-green-500 font-semibold mt-2">
                      <FaCheckCircle className="mr-2" />
                      Visit Completed
                    </p>
                  ) : booking.status === "pending" ? (
                    <p className="flex items-center text-gray-500 font-semibold mt-2">
                      <FaExclamationCircle className="mr-2" />
                      Visit Pending
                    </p>
                  ) : (
                    <p className="flex items-center text-red-500 font-semibold mt-2">
                      <FaTimesCircle className="mr-2" />
                      Visit Not Completed
                    </p>
                  )}
                </div>
                <div className="p-4 flex flex-col justify-between items-center border-t">
                  <button
                    onClick={() =>
                      booking.visitCompleted &&
                      booking.status === "confirm" &&
                      openReviewModal(booking.id)
                    }
                    className={`mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg w-full flex items-center justify-center ${
                      (!booking.visitCompleted ||
                        booking.status !== "confirm") &&
                      "opacity-50 cursor-not-allowed"
                    }`}
                    disabled={
                      !booking.visitCompleted || booking.status !== "confirm"
                    }
                  >
                    <FaStar className="mr-2" />
                    Review Property
                  </button>
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className={`mt-4 bg-rose-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg w-full flex items-center justify-center ${
                      !booking.canCancel && "opacity-50 cursor-not-allowed"
                    }`}
                    disabled={!booking.canCancel}
                  >
                    <FaTimesCircle className="mr-2" />
                    Cancel Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={closeReviewModal}
        bookingId={selectedBookingId}
      />
    </>
  );
};

export default WithAuth(MyBookings);
