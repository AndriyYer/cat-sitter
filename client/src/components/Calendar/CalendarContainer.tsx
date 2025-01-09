import { useEffect, useState } from "react";
import CalendarComponent from "./CalendarComponent";
import { ref, onValue } from "firebase/database";
import { db } from "../../services/firebaseService";

interface ContainerProps {
  setSelectedDate: (date: Date | null) => void;
  setClaimedDatesInApp: (dates: string[]) => void;
}

const CalendarContainer = ({
  setSelectedDate,
  setClaimedDatesInApp,
}: ContainerProps) => {
  const [validDates, setValidDates] = useState<string[]>([]);
  const [claimedDates, setClaimedDates] = useState<string[]>([]);

  useEffect(() => {
    const calendarRef = ref(db, "calendar");
    const unsubscribe = onValue(calendarRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setValidDates(Object.keys(data));
        const claimed = Object.keys(data).filter(
          (key) => data[key].status === "claimed"
        );
        setClaimedDates(claimed);
        setClaimedDatesInApp(claimed);
      }
    });

    return () => unsubscribe();
  }, [setClaimedDatesInApp]);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <CalendarComponent
      validDates={validDates}
      claimedDates={claimedDates}
      onSelectDate={handleSelectDate}
    />
  );
};

export default CalendarContainer;
