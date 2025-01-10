import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../services/firebaseService';

export const useCalendarDates = () => {
  const [validDates, setValidDates] = useState<string[]>([]);
  const [claimedDates, setClaimedDates] = useState<string[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const calendarRef = ref(db, "calendar");
      const unsubscribe = onValue(calendarRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setValidDates(Object.keys(data));
          const claimed = Object.keys(data).filter(
            (key) => data[key].status === "claimed"
          );
          setClaimedDates(claimed);
        } else {
          setValidDates([]);
          setClaimedDates([]);
        }
      }, (error) => {
        setError(error);
      });

      return () => unsubscribe();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    }
  }, []);

  return { validDates, claimedDates, error };
};