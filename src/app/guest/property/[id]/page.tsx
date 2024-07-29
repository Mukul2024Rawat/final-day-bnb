// app/property/[id]/page.tsx
"use client";

import { NextPage } from "next";
import PropertyHeader from "../../../../components/guest/listing/PropertyHeader";
import PropertyGallery from "../../../../components/guest/listing/PropertyGallery";
import PropertyDetails from "../../../../components/guest/listing/PropertyDetails";
import BookingSection from "../../../../components/guest/listing/BookingSection";
import PropertyReviews from "../../../../components/guest/listing/PropertyReviews";
import PropertyLocation from "../../../../components/guest/listing/PropertyLocation";
import HostInfo from "../../../../components/guest/listing/HostingInfo";
import { samplePropertyDetails } from "../../../../utils/staticData";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchPropertyDetails } from "@/api/property";
import { useDispatch } from "react-redux";
import { setBookingRequestData } from "@/store/slices/Booking";
import AmenitiesList from "@/components/guest/listing/AmenitiesList";
import dynamic from "next/dynamic";
import PropertyRules from "@/components/guest/listing/PropertyRules";
import DateRangeCom from "@/components/guest/listing/DateRangeCom";
import PropertyPageSkeleton from "@/components/guest/listing/PropertyPageSkeleton";

const PropertyMap = dynamic(
  () => import("@/components/guest/listing/PropertyMap"),
  { ssr: false }
);

interface PropertyPageProps {
  params: { id: string };
}

const PropertyPage: NextPage<PropertyPageProps> = ({ params }) => {
  const { id } = params;
  const [loading, setLoading] = useState(true);

  // api callinng

  const [propertyDetail, setPropertyDetail] = useState<any>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const getPropertyDetails = async () => {
      try {
        const data = await fetchPropertyDetails(id);
        setPropertyDetail(data);
        dispatch(
          setBookingRequestData({
            property_price: parseFloat(data.property_price.price),
            daily_discount: parseFloat(data.property_price.daily_discount),
            weekly_discount: parseFloat(data.property_price.weekly_discount),
            cleaning_fee: parseFloat(data.property_price.cleaning_fee),
            service_fee: parseFloat(data.property_price.service_fee),
          })
        );
        setLoading(false);
      } catch (error) {
        // notFound();
        console.log("not found");
      }
    };

    getPropertyDetails();
  }, []);
  


  useEffect(() => {
    if (propertyDetail) {
      window.scrollTo(0, 0);
    }
  }, [propertyDetail]);
 

  if (!propertyDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-[100px] md:pt-[200px]">
      {loading? (
        <PropertyPageSkeleton />
      ) : (
        <>
          <PropertyHeader property={propertyDetail} />
          <PropertyGallery images={propertyDetail.property_images} />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <PropertyDetails property={propertyDetail} />
              <div className="border-t border-gray-200 my-4"></div>
              <AmenitiesList
                propertyAmenities={propertyDetail.property_amenities}
              />
              <div className="border-t border-gray-200 my-4"></div>
              <DateRangeCom />
              <div className="border-t border-gray-200 my-4"></div>
            </div>
            <div className="md:col-span-1">
              <BookingSection
                property_tax={propertyDetail.property_price.tax}
                property_id={id}
              />
            </div>
          </div>
          <div className="div relative z-[1]">
            <PropertyMap
              latitude={propertyDetail.property_address.latitude}
              longitude={propertyDetail.property_address.longitude}
              title={propertyDetail.title}
            />
            <div className="border-t border-gray-200 my-4"></div>
            <HostInfo host={propertyDetail.host} />
            <div className="border-t border-gray-200 my-4"></div>
            <PropertyRules rules={propertyDetail.property_rules[0]} />
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyPage;
