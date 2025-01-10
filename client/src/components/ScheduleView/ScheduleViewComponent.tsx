import { useClaimedDates } from "../../hooks/useClaimedDates";
import { normalizeDate } from "../../utils/dates";
import type { Booking } from "../../types/types";
import classNames from "classnames";
import { useEffect, useState } from "react";

const ScheduleView: React.FC = () => {
    const { claimedDates, bookingMap, error } = useClaimedDates();
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        const formattedBookings: Booking[] = claimedDates.map((dateKey) => ({
            date: dateKey,
            name: bookingMap[dateKey].name,
        }));

        formattedBookings.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        setBookings(formattedBookings);
    }, [claimedDates, bookingMap]);

    const today = normalizeDate(new Date());

    const nextBookingIndex = bookings.findIndex((booking) => {
        const [year, month, day] = booking.date.split("-").map(Number);
        const bookingDate = normalizeDate(new Date(year, month - 1, day));
        return bookingDate >= today;
    });

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-800 rounded-lg">
                <p>Failed to load schedule data. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Schedule</h2>

            {/* Legend */}
            <div className="flex space-x-6 mb-4">
                {/* Past Bookings Legend */}
                <div className="flex items-center">
                    <span className="inline-block w-4 h-4 bg-gray-100 border border-gray-500 mr-2"></span>
                    <span className="text-sm text-gray-700">Past</span>
                </div>

                {/* Next Upcoming Booking Legend */}
                <div className="flex items-center">
                    <span className="inline-block w-4 h-4 bg-green-100 border border-green-800 mr-2"></span>
                    <span className="text-sm text-gray-700">Next Upcoming</span>
                </div>
            </div>

            {/* Booking Table */}
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                            Date
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                            Name
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {bookings.map((booking, idx) => {
                        const [year, month, day] = booking.date
                            .split("-")
                            .map(Number);
                        const bookingDate = new Date(year, month - 1, day);
                        bookingDate.setHours(0, 0, 0, 0); // Normalize to midnight
                        let rowClass = "";

                        if (bookingDate < today) {
                            rowClass = "bg-gray-100 text-gray-500";
                        } else if (idx === nextBookingIndex) {
                            rowClass = "bg-green-100 text-green-800";
                        }

                        return (
                            <tr
                                key={booking.date}
                                className={classNames(rowClass)}
                            >
                                <td className="px-4 py-2 text-sm">
                                    {bookingDate.toLocaleDateString(undefined, {
                                        weekday: "long",
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </td>
                                <td className="px-4 py-2 text-sm">
                                    {booking.name}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {bookings.length === 0 && (
                <p className="text-center text-gray-500 mt-4">
                    No bookings available.
                </p>
            )}
        </div>
    );
};

export default ScheduleView;
