import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../services/firebaseService";

interface BookingData {
  confirmed: boolean;
  name: string;
  phone: string;
  status: string;
}

interface BookingMap {
  [date: string]: BookingData;
}

export const useClaimedDates = () => {
  const [claimedDates, setClaimedDates] = useState<string[]>([]);
  const [bookingMap, setBookingMap] = useState<BookingMap>({});
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);

  useEffect(() => {
    const calendarRef = ref(db, "calendar");
    const unsubscribe = onValue(calendarRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allDates = Object.keys(data);
        const claimed = allDates.filter((key) => data[key].status === "claimed");
        setClaimedDates(claimed);
        setBookingMap(data);
      } else {
        setClaimedDates([]);
        setBookingMap({});
      }
    });

    return () => unsubscribe();
  }, []);

  const updateClaimedDates = (dates: string[]) => {
    setClaimedDates(dates);
  };

  const isDateClaimed = (date: Date) => {
    const dateKey = date.toISOString().split("T")[0];
    return claimedDates.includes(dateKey);
  };

  const fetchBookingDetails = (date: Date) => {
    const dateKey = date.toISOString().split("T")[0];
    const booking = bookingMap[dateKey];
    if (booking) {
      setSelectedBooking(booking);
    } else {
      setSelectedBooking(null);
    }
  };

  return {
    claimedDates,
    bookingMap,
    selectedBooking,
    updateClaimedDates,
    isDateClaimed,
    fetchBookingDetails,
  };
};
