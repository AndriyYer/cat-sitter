import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../services/firebaseService";
import { BookingData, BookingMap } from "../types/types";
import { formatDateKey } from "../utils/dates";

export const useClaimedDates = () => {
  const [claimedDates, setClaimedDates] = useState<string[]>([]);
  const [bookingMap, setBookingMap] = useState<BookingMap>({});
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const calendarRef = ref(db, "calendar");
      const unsubscribe = onValue(calendarRef, (snapshot) => {
        setIsLoading(false);
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
      }, (error) => {
        setError(error);
        setIsLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setIsLoading(false);
    }
  }, []);

  const updateClaimedDates = (dates: string[]) => {
    setClaimedDates(dates);
  };

  const isDateClaimed = (date: Date) => {
    const dateKey = formatDateKey(date);
    return claimedDates.includes(dateKey);
  };

  const fetchBookingDetails = (date: Date) => {
    const dateKey = formatDateKey(date);
    const booking = bookingMap[dateKey];
    setSelectedBooking(booking || null);
  };

  return {
    claimedDates,
    bookingMap,
    selectedBooking,
    updateClaimedDates,
    isDateClaimed,
    fetchBookingDetails,
    error,
    isLoading
  };
};