export interface BookingData {
    confirmed: boolean;
    name: string;
    phone: string;
    status: string;
  }
  
  export interface BookingMap {
    [date: string]: BookingData;
  }
  
  export interface Booking {
    date: string;
    name: string;
  }