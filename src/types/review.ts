export interface ReviewData {
    cleaning: number;
    accuracy: number;
    checkin: number;
    communication: number;
    location: number;
    value_for_money: number;
    comments: string;
  }
  export interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingId: string | null;
  }
  
  export interface Ratings {
    cleaning: number;
    accuracy: number;
    checkin: number;
    communication: number;
    location: number;
    value_for_money: number;
  }
  export interface Error {
    property: string;
    message: string;
  }
  