import { PropertyBookingRequestData } from "@/types/bookingSlice";
import { api } from "./index";

// get property data by it's id
export const fetchPropertyDetails = async (id: string) => {
  try {
    const response = await api.get(`/property/${id}/list-one`);
    return response.data;
  } catch (error) {
    
    throw error;
  }
};


//book the property 
interface BookProperty {
    bookingData:PropertyBookingRequestData;
    property_id?: string;
}


export const bookPropertyApi = async({bookingData,property_id='58'}:BookProperty)=>{
    try {
      const response = await api.post(`/property/${property_id}/booking`, bookingData,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      
      throw error;
    }
  
}


