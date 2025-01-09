import { useEffect, useState } from "react";
import CalendarContainer from "./components/Calendar/CalendarContainer";
import ModalComponent from "./components/Modal/ModalComponent";
import { useClaimedDates } from "./hooks/useClaimedDates";
import "./App.css";

const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
};

function App() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);

    const {
        claimedDates,
        whoClaimedDate,
        updateClaimedDates,
        isDateClaimed,
        fetchWhoClaimedDate,
    } = useClaimedDates();

    // Watch for changes to selectedDate and claimedDates,
    // fetch "who claimed" data if the date is claimed
    useEffect(() => {
        fetchWhoClaimedDate(selectedDate);
    }, [selectedDate, claimedDates]);

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-50">
            <h1 className="text-center text-2xl font-bold text-gray-800 mt-8 mb-6">
                The Mizu and Binki Calendar
            </h1>
            <div className="flex flex-col items-center space-y-4">
                <CalendarContainer
                    setSelectedDate={setSelectedDate}
                    setClaimedDatesInApp={updateClaimedDates}
                />
                {!selectedDate && <><p>Ideally pick a day so that the cats are visited at least every second day.</p></>}
                {selectedDate && (
                    <>
                        {isDateClaimed(selectedDate) ? (
                            <div className="text-lg text-gray-700 text-center">
                                <p>
                                    Sorry,{" "}
                                    <strong>
                                        {selectedDate.toLocaleString(
                                            "en-US",
                                            dateOptions
                                        )}
                                    </strong>{" "}
                                    has already been claimed by{" "}
                                    <strong>{whoClaimedDate}</strong>.
                                </p>
                                <p>
                                    If that's you, thank you! If you need to
                                    cancel, text Andriy
                                </p>
                                <p className="text-red-600 mt-2">
                                    Please pick a different date.
                                </p>
                            </div>
                        ) : (
                            <>
                                <span className="text-lg text-gray-700">
                                    You can stop by on{" "}
                                    <strong>
                                        {selectedDate.toLocaleString(
                                            "en-US",
                                            dateOptions
                                        )}
                                        ?
                                    </strong>
                                </span>
                                <button
                                    type="button"
                                    onClick={handleModalOpen}
                                    className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
                                >
                                    Confirm
                                </button>
                            </>
                        )}
                    </>
                )}

                <ModalComponent
                    isModalOpen={isModalOpen}
                    closeModal={handleModalClose}
                    selectedDate={selectedDate!}
                />
            </div>
        </div>
    );
}

export default App;
