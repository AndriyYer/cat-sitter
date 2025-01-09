import { useState } from "react";
import { db } from "../services/firebaseService";
import { onValue, ref } from "firebase/database";

export function useClaimedDates() {
  const [claimedDates, setClaimedDates] = useState<string[]>([]);
  const [whoClaimedDate, setWhoClaimedDate] = useState<string>("");

  // This function updates the list of all claimed date keys
  function updateClaimedDates(dates: string[]) {
    setClaimedDates(dates);
  }

  // A helper to check if a given date is claimed
  function isDateClaimed(date: Date | null) {
    if (!date) return false;
    const dateKey = date.toISOString().split("T")[0];
    return claimedDates.includes(dateKey);
  }

  // A function to fetch the "whoClaimedDate" from Firebase when needed
  function fetchWhoClaimedDate(date: Date | null) {
    if (!date) {
      setWhoClaimedDate("");
      return;
    }

    const dateKey = date.toISOString().split("T")[0];
    if (isDateClaimed(date)) {
      const dayRef = ref(db, `calendar/${dateKey}`);
      onValue(dayRef, (snapshot) => {
        const data = snapshot.val();
        setWhoClaimedDate(data?.name ?? "someone mysterious");
      });
    } else {
      setWhoClaimedDate("");
    }
  }

  return {
    claimedDates,
    whoClaimedDate,
    updateClaimedDates,
    isDateClaimed,
    fetchWhoClaimedDate
  };
}
