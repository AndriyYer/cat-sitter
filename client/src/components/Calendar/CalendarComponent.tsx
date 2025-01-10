import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./styles.css";
import { formatDateKey } from "../../utils/dates";

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
        validDates.includes(formatDateKey(date));

    const isClaimedDate = (date: Date) =>
        claimedDates.includes(formatDateKey(date));

    const handleClickDay = (date: Date) => {
        if (isValidDate(date)) {
            onSelectDate(date);
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-4 max-w-md w-full">
            <div className="mb-4 text-sm">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-teal-50 border border-teal-500"></div>
                    <span>Available Dates</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-50 border border-red-500"></div>
                    <span>Claimed Dates</span>
                </div>
            </div>

            <Calendar
                showNavigation={false}
                onClickDay={handleClickDay}
                tileDisabled={({ date }) => !isValidDate(date)}
                tileClassName={({ date, view }) => {
                    if (view === "month") {
                        if (isClaimedDate(date)) {
                            return "bg-red-50 text-red-700 hover:bg-red-100 cursor-pointer";
                        }
                        if (isValidDate(date)) {
                            return "bg-teal-50 text-teal-700 hover:bg-teal-100 cursor-pointer";
                        }
                    }
                    return "";
                }}
                className="react-calendar mx-auto"
            />
        </div>
    );
}
