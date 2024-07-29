"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { HotelData, ViewportCorners } from "@/types/standardSearch";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { debounce } from "lodash";
import { dummyHotelData } from "@/utils/staticData";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  setBookingRequestData,
  setGuestCountBooking,
} from "@/store/slices/Booking";
import { NewPropertyData, PropertyData } from "@/types/property";
import { CardSkeleton } from "@/components/guest/standardSearch/CardSkeleton";

const MapSearch = dynamic(
  () => import("@/components/guest/standardSearch/Map"),
  { ssr: false }
);
const HotelCard = dynamic(
  () => import("@/components/guest/standardSearch/PropertyCard"),
  { ssr: false }
);

function StandardSearch() {
  const [viewportCorners, setViewportCorners] = useState<ViewportCorners>({
    northEast: { lat: 0, lng: 0 },
    southWest: { lat: 0, lng: 0 },
  });
  const [properties, setProperties] = useState<NewPropertyData[]>([]);
  const router = useRouter();
  const [hotelData, setHotelData] = useState<HotelData[]>(dummyHotelData);
  const locationValue = useSelector(
    (state: RootState) => state.search.locationValue
  );
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const guestCounts = useSelector(
    (state: RootState) => state.search.guestCount
  );
  const startDate = useSelector((state: RootState) => state.search.startDate);
  const endDate = useSelector((state: RootState) => state.search.endDate);

  const handleHotelClick = (hotelId: number) => {
    dispatch(
      setBookingRequestData({ checkin_date: startDate, checkout_date: endDate })
    );
    dispatch(setGuestCountBooking(guestCounts));
    router.push(`/guest/property/${hotelId}`);
  };

  const fetchData = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await axios.get(
        "https://dev-api-airnb.rubico.dev/api/v1/property/list",
        {
          params: {
            boundingBox: JSON.stringify(viewportCorners),
            checkIn: startDate,
            checkOut: endDate,
            guestCount: JSON.stringify(guestCounts),
          },
        }
      );
      const PropertyData: PropertyData[] = response.data;

      const extractedData = PropertyData.map((property) => ({
        id: property.id,
        title: property.title,
        subtitle: property.subtitle,
        capacity: property.capacity,
        lat: property.property_address.latitude,
        lng: property.property_address.longitude,
        imageUrl: property.property_images.map((image) => image.image),
        price: property.property_price.price,
        property_amenities: property.property_amenities.map(
          (amenity) => amenity.amenity.name
        ),
      }));

      setProperties(extractedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const debouncedFetchData = debounce(fetchData, 2000);
  useEffect(() => {
    debouncedFetchData();
    return debouncedFetchData.cancel;
  }, [viewportCorners, locationValue, startDate, endDate, guestCounts]);

  return (
    <>
      <div className="mainSearchContainer md:pt-[160px] sm:pt-[90px] pt-[77px]">
        <div className="secondDiv h-[calc(100vh-170px)] bg-white flex flex-col-reverse lg:flex-row">
          <div className="left flex-[0.6] py-1 px-2 overflow-auto">
            {isLoading ? (
              Array(4)
                .fill(0)
                .map((_, index) => (
                  <React.Fragment key={index}>
                    <CardSkeleton />
                    {index < 4 - 1 && (
                      <div
                        className="border-t border-gray-200 my-4"
                        key={`divider-${index}`}
                      ></div>
                    )}
                  </React.Fragment>
                ))
            ) : properties.length > 0 ? (
              properties.map((hotel, index) => (
                <React.Fragment key={hotel.id}>
                  <HotelCard
                    imageUrl={hotel.imageUrl[0]}
                    name={hotel.title}
                    rating={4.89}
                    reviews={356}
                    description={hotel.subtitle}
                    price={hotel.price}
                    capacity={`${hotel.capacity} guests`}
                    amenities={hotel.property_amenities}
                    handleHotelClick={() => handleHotelClick(hotel.id)}
                  />
                  {index < properties.length - 1 && (
                    <div
                      className="border-t border-gray-200 my-4"
                      key={`divider-${hotel.id}`}
                    ></div>
                  )}
                </React.Fragment>
              ))
            ) : (
              <div className="text-center py-20">
                <p className="text-xl text-gray-600">
                  No properties listed in this area.
                </p>
              </div>
            )}
          </div>
          <div className="right flex-[0.4] overflow-hidden z-[1]">
            <MapSearch
              setViewportCorners={setViewportCorners}
              hotelData={properties}
            />
          </div>
        </div>
      </div>
    </>
  );
}
export default StandardSearch;
