import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./styles.css";

interface Props {
    onSelectDate: (date: Date) => void;
    validDates: string[];
    claimedDates: string[];
}

export default function CalendarComponent({
    onSelectDate,
    validDates,
    claimedDates,
}: Props) {
    const isValidDate = (date: Date) =>
        validDates.includes(date.toISOString().split("T")[0]);

    const isClaimedDate = (date: Date) =>
        claimedDates.includes(date.toISOString().split("T")[0]);

    const handleClickDay = (date: Date) => {
        if (isValidDate(date)) {
            onSelectDate(date);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-4">
            <Calendar
                showNavigation={false}
                onClickDay={handleClickDay}
                tileDisabled={({ date }) => !isValidDate(date)}
                tileClassName={({ date, view }) => {
                    if (view === "month") {
                        if (isClaimedDate(date)) {
                            return "bg-red-100 text-red-600 font-semibold claimed-day";
                        }
                        if (isValidDate(date)) {
                            return "bg-green-50 text-green-700 valid-day";
                        }
                    }
                    return "";
                }}
                className="react-calendar"
            />
        </div>
    );
}
